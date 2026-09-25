"""Reproducible concept geometry, program ledger, drawings and CAD exports.
Run through engineering/run.py with the repository's locked Python environment.
No member sizing, geotechnical, fire, daylight or fluid simulation is performed.
"""
from pathlib import Path
import sys, json, math, textwrap, importlib.metadata
ROOT = Path(__file__).resolve().parent
import numpy as np
import shapely
from shapely.geometry import Polygon, Point, LineString, box
from shapely.ops import unary_union
from shapely.affinity import scale, rotate, translate
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon as PatchPolygon, Rectangle
import trimesh, ezdxf
import plotly.graph_objects as go
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader

P = json.loads((ROOT / 'parameters.json').read_text())
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)
SQ = .09290304
INK, TEAL, GOLD, PALE, GREY = '#233a42', '#387a78', '#b87d3b', '#dfede7', '#71858d'
plt.rcParams.update({'font.family':'DejaVu Sans', 'font.size':10, 'axes.labelcolor':INK,
                     'text.color':INK, 'axes.spines.top':False, 'axes.spines.right':False,
                     'axes.edgecolor':'#a2b4b6', 'figure.facecolor':'#ffffff', 'svg.hashsalt':'arcology-massing-study-01'})

def poly(radius, x=0, y=0, n=12):
    a=np.arange(n)*2*math.pi/n
    return Polygon(np.column_stack((x+radius*np.cos(a),y+radius*np.sin(a))))

def polygons(g):
    if g.is_empty: return []
    if g.geom_type=='Polygon': return [g]
    return [p for p in getattr(g,'geoms',[]) if p.geom_type=='Polygon']

def geometry(tiers=None):
    g=P['geometry']; n=tiers or g['main_tiers']; ftotal=g['total_main_floors']
    # Fixed-height wing levels are independent of the variable central tier count.
    main_breaks=[round(i*ftotal/n) for i in range(n+1)]
    wing_breaks=[i*g['wing_tier_floors'] for i in range(len(g['wing_radii_ratios'])+1)]
    breaks=sorted(set(main_breaks+wing_breaks))
    holes=[poly(g['central_court_radius_ratio'],n=24)]
    for k in range(6):
        a=k*math.pi/3
        holes.append(poly(g['six_court_radius_ratio'],g['six_court_center_radius_ratio']*math.cos(a),g['six_court_center_radius_ratio']*math.sin(a),24))
        slot=box(g['radial_open_street_start_ratio'],-g['radial_open_street_width_ratio']/2,1.55,g['radial_open_street_width_ratio']/2)
        holes.append(rotate(slot,30+k*60,origin=(0,0)))
    voids=unary_union(holes)
    bands=[]
    for start,end in zip(breaks,breaks[1:]):
        if start>=ftotal: continue
        i=max(j for j,b in enumerate(main_breaks[:-1]) if b<=start)
        r=1-(1-g['summit_radius_ratio'])*i/(n-1)
        components=[poly(r,n=g['plan_facets'])]
        wi=start//g['wing_tier_floors']
        if wi<len(g['wing_radii_ratios']):
            for k in range(g['wing_count']):
                a=k*2*math.pi/g['wing_count']; c=g['wing_center_radius_ratio']
                components.append(poly(g['wing_radii_ratios'][wi],c*math.cos(a),c*math.sin(a),g['plan_facets']))
        envelope=unary_union(components)
        plate=envelope.difference(voids)
        assert plate.is_valid and not plate.is_empty
        bands.append({'floor_start':start,'floors':end-start,'plate':plate,'envelope':envelope,
                      'sum_components_area':sum(c.area for c in components)})
    return bands

def compute_cases():
    c=P['compute']; per=sum(c['usable_m2_per_equipped_rack'].values()); result=[]
    for active in c['active_rack_cases']:
        installed=math.ceil(active*(1+c['extra_equipped_redundant_rack_fraction']))
        result.append({'active_racks':active,'equipped_racks':installed,'usable_m2':installed*per,
                       'usable_billion_sqft':installed*per/SQ/1e9,
                       'active_it_gw':active*c['active_it_kw_per_rack']/1e6,
                       'facility_gw':active*c['active_it_kw_per_rack']*c['assumed_pue']/1e6})
    return result

COMPUTE=compute_cases()
COMP=next(c for c in COMPUTE if c['active_racks']==P['compute']['ledger_active_racks'])

def make_case(case, tiers=None):
    humans=P['requirements']['humans']; private=humans*P['requirements']['private_home_sqft_per_human']*SQ
    residential=private/case['residential_private_efficiency']
    usable=residential/case['residential_share_of_usable']; target=usable/case['usable_to_gross']
    bands=geometry(tiers)
    normalized=sum(b['plate'].area*b['floors'] for b in bands)
    # Reserve local court/street volume separately from the explicit macro voids.
    # This is volume accounting, not proof that a full district arrangement fits.
    d=P['district'];count=humans/d['humans']
    district_private=d['humans']*P['requirements']['private_home_sqft_per_human']*SQ
    district_resgross=district_private/case['residential_private_efficiency']/case['usable_to_gross']
    district_localgross=d['humans']*d['local_civic_usable_sqft_per_human']*SQ/case['usable_to_gross']
    district_floor_slots=d['district_pitch_m']**2*(d['housing_floors_per_block']+d['local_service_podium_floors'])
    distributed_void=(district_floor_slots-district_resgross-district_localgross)*count
    assert distributed_void>0
    radius=math.sqrt((target+distributed_void)/normalized)
    for b in bands:
        for key in ['plate','envelope']: b[key]=scale(b[key],xfact=radius,yfact=radius,origin=(0,0))
        b['sum_components_area']*=radius**2
    gross_slots=sum(b['plate'].area*b['floors'] for b in bands)
    gross=gross_slots-distributed_void
    over=sum((b['sum_components_area']-b['envelope'].area)*b['floors'] for b in bands)
    void=sum((b['envelope'].area-b['plate'].area)*b['floors'] for b in bands)
    # Upper plate containment is necessary for the proposed vertical support logic,
    # but not sufficient to establish structural feasibility.
    upper_overhang=max([bands[i]['plate'].difference(bands[i-1]['plate']).area for i in range(1,len(bands))] or [0])
    assert upper_overhang < 1e-5*radius**2
    assert abs(gross-target)/target<1e-10
    rows={'Private homes':private,'Shared residential':residential-private}
    index=0 if case['id']=='A' else 1
    for name,values in P['program_per_human_sqft'].items(): rows[name]=humans*values[index]*SQ
    rows['Compute facilities']=COMP['usable_m2']
    rows['Unassigned program reserve']=usable-sum(rows.values())
    assert rows['Unassigned program reserve']>=0 and abs(sum(rows.values())-usable)<1
    g=P['geometry']; bounds=bands[0]['envelope'].bounds
    summit=bands[-1]['plate'].area
    roof=0
    for i,b in enumerate(bands):
        roof += (b['plate'].difference(bands[i+1]['plate']).area if i+1<len(bands) else b['plate'].area)
    result={**case,'main_tiers':tiers or g['main_tiers'],'main_height_m':g['total_main_floors']*g['floor_height_m'],
            'wing_height_m':len(g['wing_radii_ratios'])*g['wing_tier_floors']*g['floor_height_m'],
            'central_base_radius_m':radius,'width_x_m':bounds[2]-bounds[0],'width_y_m':bounds[3]-bounds[1],
            'gross_m2':gross,'usable_m2':usable,'private_home_m2':private,
            'district_count':count,'local_district_void_floor_equivalent_m2':distributed_void,
            'post_macro_void_floor_slots_m2':gross_slots,
            'built_fraction_of_post_macro_void_volume':gross/gross_slots,
            'program_only_width_x_m_without_local_void_budget':(bounds[2]-bounds[0])*math.sqrt(target/(target+distributed_void)),
            'district_placement_status':'Local empty volume reserved arithmetically; a complete 3D arrangement of the districts is not established.',
            'base_envelope_m2':bands[0]['envelope'].area,'base_post_macro_void_plate_m2':bands[0]['plate'].area,
            'overlap_floor_area_removed_m2':over,'void_floor_area_removed_m2':void,
            'pre_void_enclosed_potential_m2':gross_slots+void,'summit_roof_m2':summit,
            'all_exposed_roof_surface_m2':roof,'upper_overhang_area_m2':upper_overhang,
            'program_usable_m2':rows,
            'bands':[{'floor_start':b['floor_start'],'floors':b['floors'],'post_macro_void_plate_m2':b['plate'].area} for b in bands]}
    return result,bands

def draw_poly(ax,g,fc=PALE,ec=INK,alpha=1,lw=.7,div=1):
    for p in polygons(g):
        ax.add_patch(PatchPolygon(np.asarray(p.exterior.coords)/div,facecolor=fc,edgecolor=ec,alpha=alpha,lw=lw))
        for ring in p.interiors:
            ax.add_patch(PatchPolygon(np.asarray(ring.coords)/div,facecolor='white',edgecolor=ec,lw=lw))

def lines(g):
    if g.is_empty:return []
    if g.geom_type=='LineString':return [g]
    return [l for l in getattr(g,'geoms',[]) if l.geom_type=='LineString']

def section(ax,bands,color):
    fh=P['geometry']['floor_height_m']
    for b in bands:
        for l in lines(b['plate'].intersection(LineString([(-30000,0),(30000,0)]))):
            xs=np.array(l.coords)[:,0]/1000; z=b['floor_start']*fh/1000; h=b['floors']*fh/1000
            ax.add_patch(Rectangle((xs.min(),z),xs.max()-xs.min(),h,facecolor=color,edgecolor='white',lw=.6))
    ax.axhline(0,color=INK,lw=1)
    ax.set_xlabel('Distance east / west (km)');ax.set_ylabel('Height (km)')
    ax.set_aspect('equal');ax.grid(alpha=.15)

def mesh_for(b):
    meshes=[]; fh=P['geometry']['floor_height_m']
    for p in polygons(b['plate']):
        m=trimesh.creation.extrude_polygon(p,height=b['floors']*fh,engine='earcut')
        m.apply_translation([0,0,b['floor_start']*fh])
        assert m.is_watertight and m.is_winding_consistent
        assert abs(m.volume-p.area*b['floors']*fh)/max(m.volume,1)<1e-7
        meshes.append(m)
    return trimesh.util.concatenate(meshes)

def export_case(r,bands):
    scene=trimesh.Scene(); meshes=[]
    for i,b in enumerate(bands):
        m=mesh_for(b); shade=np.array([70,132,126,255]) if r['id']=='A' else np.array([180,132,70,255])
        shade[:3]=np.minimum(245,shade[:3]+i*4)
        m.visual.vertex_colors=np.tile(shade,(len(m.vertices),1));scene.add_geometry(m,node_name=f"{r['id']}_floor_{b['floor_start']+1}")
        meshes.append(m)
    # glTF uses Y-up; calculations and CAD plans use X/Y horizontal with Z-up.
    scene.apply_transform(np.array([[1,0,0,0],[0,0,1,0],[0,-1,0,0],[0,0,0,1]]))
    (OUT/f"case-{r['id']}-massing.glb").write_bytes(scene.export(file_type='glb'))
    loaded=trimesh.load(OUT/f"case-{r['id']}-massing.glb",force='scene')
    assert len(loaded.geometry)==len(meshes)
    assert abs(np.ptp(loaded.bounds[:,1])-r['main_height_m'])<.01
    doc=ezdxf.new('R2010');doc.units=6;ms=doc.modelspace()
    for i,b in enumerate(bands):
        layer=f"TIER_{i+1:02d}";doc.layers.new(layer,dxfattribs={'color':3 if r['id']=='A' else 30})
        for p in polygons(b['plate']):
            for ring in [p.exterior,*p.interiors]:ms.add_lwpolyline(list(ring.coords)[:-1],close=True,dxfattribs={'layer':layer})
    ms.add_text(f"Case {r['id']} - meters - massing only",dxfattribs={'height':100}).set_placement((r['width_x_m']/-2,-r['width_y_m']/2-400))
    fn=OUT/f"case-{r['id']}-plans.dxf";doc.saveas(fn)
    assert not ezdxf.readfile(fn).audit().has_errors
    return meshes

CASES=[make_case(c) for c in P['cases']]
MESHES=[export_case(r,b) for r,b in CASES]
MAX=CASES[1][0]['width_x_m']/2000*1.06

def savefig(fig,name):
    fig.savefig(OUT/f'{name}.png',dpi=170,bbox_inches='tight',facecolor='white')
    fig.savefig(OUT/f'{name}.svg',bbox_inches='tight',facecolor='white',metadata={'Date':'2026-09-25'})
    plt.close(fig)

def render_orthographic(meshes,ci):
    # Explicit depth buffer avoids painter-order artifacts in thin, overlapping tiers.
    az,el=np.radians([-65,32])
    right=np.array([-np.sin(az),np.cos(az),0])
    up=np.array([-np.sin(el)*np.cos(az),-np.sin(el)*np.sin(az),np.cos(el)])
    eye=np.array([np.cos(el)*np.cos(az),np.cos(el)*np.sin(az),np.sin(el)])
    basis=np.stack([right,up,eye],axis=1)
    size=1400;span=2*MAX*1.08
    depth=np.full((size,size),-np.inf);pixels=np.ones((size,size,3))
    light=np.array([-.5,-.4,.75]);light/=np.linalg.norm(light)
    for i,m in enumerate(meshes):
        color=np.array(plt.cm.GnBu(.38+i*.028) if ci==0 else plt.cm.YlOrBr(.32+i*.030))[:3]
        points=m.vertices/1000@basis
        points[:,:2]=(points[:,:2]/span+.5)*(size-1)
        for face,normal in zip(m.faces,m.face_normals):
            if normal@eye<=0:continue
            tri=points[face];lo=np.maximum(0,np.floor(tri[:,:2].min(axis=0)).astype(int));hi=np.minimum(size-1,np.ceil(tri[:,:2].max(axis=0)).astype(int))
            if np.any(hi<lo):continue
            x,y=np.meshgrid(np.arange(lo[0],hi[0]+1)+.5,np.arange(lo[1],hi[1]+1)+.5)
            a,b,c=tri;den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
            if abs(den)<1e-12:continue
            wa=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/den
            wb=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/den;wc=1-wa-wb
            z=wa*a[2]+wb*b[2]+wc*c[2]
            old=depth[lo[1]:hi[1]+1,lo[0]:hi[0]+1]
            mask=(wa>=-1e-9)&(wb>=-1e-9)&(wc>=-1e-9)&(z>old)
            old[mask]=z[mask]
            pixels[lo[1]:hi[1]+1,lo[0]:hi[0]+1][mask]=color*(.55+.45*max(0,normal@light))
    return pixels[::-1]

fig=plt.figure(figsize=(15,7.2))
for ci,((r,bands),meshes) in enumerate(zip(CASES,MESHES)):
    ax=fig.add_axes([.025+ci*.5,.13,.45,.67])
    ax.imshow(render_orthographic(meshes,ci));ax.set_axis_off()
    fig.text(.25+ci*.5,.855,f"{r['id']}  {r['name']}",ha='center',fontsize=15)
    fig.text(.25+ci*.5,.815,f"{r['width_x_m']/1000:.1f} km wing-to-wing | {r['gross_m2']/SQ/1e9:.1f} billion sqft gross",ha='center',fontsize=12)
fig.suptitle('One public summit, six wings, two program envelopes',fontsize=20,y=.98)
fig.text(.5,.08,'True proportions | 1,536 m high | Macro openings modeled; local court/street volume reserved, not yet placed.',ha='center',fontsize=11)
fig.text(.5,.035,'Solid bands show envelope volume, not solid concrete or fully built floors.',ha='center',fontsize=10)
savefig(fig,'01-massing-comparison')

fig=plt.figure(figsize=(15,10));gs=fig.add_gridspec(2,2,height_ratios=[3,1],hspace=.22)
for ci,(r,bands) in enumerate(CASES):
    ax=fig.add_subplot(gs[0,ci]);draw_poly(ax,bands[0]['envelope'],fc='#f3f1ed',ec=GREY,div=1000)
    for i,b in enumerate(bands):draw_poly(ax,b['plate'],fc=plt.cm.GnBu(.22+i*.035) if ci==0 else plt.cm.YlOrBr(.15+i*.035),ec='white',div=1000,lw=.7)
    ax.axhline(0,color=INK,lw=.9,ls='--');ax.set(xlim=(-MAX,MAX),ylim=(-MAX,MAX),aspect='equal')
    ax.set_title(f"{r['id']}  Plan | summit roof {r['summit_roof_m2']/1e6:.1f} km²")
    ax.set_xlabel('East / west (km)');ax.set_ylabel('North / south (km)')
    ax=fig.add_subplot(gs[1,ci]);section(ax,bands,TEAL if ci==0 else GOLD)
    ax.set(xlim=(-MAX,MAX),ylim=(-.12,1.8));ax.set_title('Section through two opposing wings and the central court',fontsize=10)
fig.suptitle('Geometry with macro openings and a local district void allowance',fontsize=18,y=.98)
fig.text(.5,.01,'12 main tiers / 360 main floors / 1,536 m high; 3 wing tiers / 90 floors / 384 m high. Study choices, not fixed requirements.',ha='center',fontsize=10)
savefig(fig,'02-plans-and-sections')

def district_model():
    d=P['district'];private=d['humans']*P['requirements']['private_home_sqft_per_human']*SQ
    res=private/d['private_fraction_of_residential_usable'];resgross=res/d['residential_usable_to_gross']
    ringarea=resgross/(d['residential_blocks']*d['housing_floors_per_block'])
    side=d['block_outer_side_m'];court=math.sqrt(side**2-ringarea)
    centers=[((x-1.5)*d['block_spacing_m'],(y-1.5)*d['block_spacing_m']) for y in range(4) for x in range(4)]
    blocks=[]
    for x,y in centers:blocks.append(box(x-side/2,y-side/2,x+side/2,y+side/2).difference(box(x-court/2,y-court/2,x+court/2,y+court/2)))
    local=d['humans']*d['local_civic_usable_sqft_per_human']*SQ
    # Civic pedestal matches the same open courts as its residential block.
    # It is deeper than the dwelling ring. Solve its outer side from target area.
    podium_ringarea=local/.7/(16*d['local_service_podium_floors'])
    podiumside=math.sqrt(podium_ringarea+court**2)
    assert podiumside<d['block_spacing_m']
    podiums=[box(x-podiumside/2,y-podiumside/2,x+podiumside/2,y+podiumside/2).difference(box(x-court/2,y-court/2,x+court/2,y+court/2)) for x,y in centers]
    total_usable=CASES[0][0]['usable_m2']*d['humans']/P['requirements']['humans']
    remote=total_usable-res-local
    r={'humans':d['humans'],'paired_ai':d['paired_ai'],'private_home_m2':private,'residential_usable_m2':res,
       'residential_gross_m2':resgross,'block_outer_m':side,'court_clear_m':court,'housing_ring_depth_m':(side-court)/2,
       'blocks':16,'housing_floors_per_block':24,'podium_floors':d['local_service_podium_floors'],'podium_outer_m':podiumside,
       'housing_height_m':24*P['geometry']['floor_height_m'],'total_height_m':(24+d['local_service_podium_floors'])*P['geometry']['floor_height_m'],
       'local_civic_usable_m2':local,'citywide_facility_share_usable_m2':remote,'total_allocated_usable_m2':total_usable,
       'gross_area_drawn_m2':resgross+local/.7,'gross_citywide_share_m2':remote/.7,
       'local_civic_split_sqft_per_human':{'education':50,'health':20,'workplaces_and_markets':70,'indoor_commons':30,'utility_and_transit_rooms':30}}
    assert abs(sum(p.area for p in blocks)*24-resgross)<.01
    assert abs(unary_union(podiums).area*d['local_service_podium_floors']-local/.7)<.01
    return r,blocks,podiums,centers

D,BLOCKS,PODIUMS,CENTERS=district_model()
fig,axs=plt.subplots(1,2,figsize=(15,8),gridspec_kw={'width_ratios':[1,1.15]})
fig.subplots_adjust(bottom=.25,top=.84,wspace=.22)
ax=axs[0]
for i,(b,p,(x,y)) in enumerate(zip(BLOCKS,PODIUMS,CENTERS)):
    draw_poly(ax,p,fc='#f1e6d6',ec=GOLD);draw_poly(ax,b,fc=PALE)
    ax.text(x,y,f'{i+1:02d}',ha='center',va='center',fontsize=9)
ax.plot([-280,280],[0,0],color=TEAL,lw=3,label='Public transit / street spine')
ax.plot([0,0],[-280,280],color=GOLD,lw=2,ls='--',label='Freight / service route')
ax.set(xlim=(-300,300),ylim=(-300,300),aspect='equal',xlabel='Meters',ylabel='Meters')
ax.set_title('District plan | 16 courtyard blocks')
ax.legend(loc='upper center',bbox_to_anchor=(.5,-.16),fontsize=9,frameon=False)
ax=axs[1];fh=P['geometry']['floor_height_m'];start=D['podium_floors']*fh;court=D['court_clear_m'];pd=D['podium_outer_m']
for x in [-70,70]:
    for lo,hi in [(-pd/2,-court/2),(court/2,pd/2)]:ax.add_patch(Rectangle((x+lo,0),hi-lo,start,facecolor='#e6cba3',edgecolor=GOLD))
    for lo,hi in [(-50,-court/2),(court/2,50)]:
        ax.add_patch(Rectangle((x+lo,start),hi-lo,24*fh,facecolor=PALE,edgecolor=INK))
        for floor in range(1,24):ax.plot([x+lo,x+hi],[start+floor*fh]*2,color='#8aa49d',lw=.45)
        ax.plot([x+(lo+hi)/2]*2,[0,start+24*fh],color=TEAL,lw=2,ls='--')
    ax.annotate(f'{court:.1f} m court',xy=(x,55),ha='center',fontsize=9)
ax.annotate('Aligned support corridors\n(position schematic)',xy=(-110,45),xytext=(-130,145),arrowprops={'arrowstyle':'->','color':TEAL},fontsize=10)
ax.annotate(f"{D['podium_floors']} local civic / service floors",xy=(106,5),xytext=(0,-28),arrowprops={'arrowstyle':'->','color':GOLD},fontsize=10)
ax.set(xlim=(-150,150),ylim=(-40,165),aspect='equal',xlabel='Meters',ylabel='Height (m)')
ax.set_title('Section through two blocks | 24 housing floors')
fig.suptitle('20,000 humans + 20,000 paired AI: a district within the city',fontsize=18,y=.98)
fig.text(.5,.07,f"100 m blocks | {court:.1f} m clear courts | {D['housing_ring_depth_m']:.1f} m dwelling bands | 750 sqft private home area per human",ha='center',fontsize=11)
fig.text(.5,.03,'Representative district segment, not a full-height tower design. Foundations, core sizes, homes and fire compartments require further design.',ha='center',fontsize=10)
savefig(fig,'03-district-plan-section')

doc=ezdxf.new('R2010');doc.units=6;ms=doc.modelspace()
for name,polys in [('HOUSING',BLOCKS),('CIVIC_PODIUM',PODIUMS)]:
    doc.layers.new(name)
    for p in polys:
        for ring in [p.exterior,*p.interiors]:ms.add_lwpolyline(list(ring.coords)[:-1],close=True,dxfattribs={'layer':name})
ms.add_text('District plan - meters - conceptual area study',dxfattribs={'height':5}).set_placement((-280,-295))
doc.saveas(OUT/'district-plan.dxf');assert not ezdxf.readfile(OUT/'district-plan.dxf').audit().has_errors

SUMMIT=[]
s=P['summit'];netcar=s['illustrative_express_car_people']*60/s['illustrative_round_trip_minutes']*s['loading_efficiency']*(1-s['unavailable_capacity_fraction'])
for frac in s['daily_visitor_fractions_of_humans']:
    daily=frac*P['requirements']['humans'];arr=daily/s['arrival_window_hours']*s['peak_factor'];occ=arr*s['mean_visit_hours']
    SUMMIT.append({'daily_human_visits':daily,'peak_arrivals_per_hour':arr,'peak_simultaneous_human_visitors':occ,
                   'illustrative_express_cars_required':math.ceil(arr/netcar),
                   'public_area_required_m2':occ*s['assumed_m2_per_visitor'],
                   'case_A_public_summit_m2':CASES[0][0]['summit_roof_m2']*s['public_fraction_of_roof']})

SENS=[]
for tier in [8,12,16]:
    rr,_=make_case(P['cases'][0],tier)
    SENS.append({k:rr[k] for k in ['main_tiers','width_x_m','gross_m2','summit_roof_m2','main_height_m']})

fig,axs=plt.subplots(1,2,figsize=(14,6))
colors=[INK,TEAL,GOLD]
for i,(r,_) in enumerate(CASES):
    vals=[r['program_usable_m2']['Private homes'],r['program_usable_m2']['Shared residential'],r['usable_m2']-r['program_usable_m2']['Private homes']-r['program_usable_m2']['Shared residential']]
    left=0
    for j,v in enumerate(vals):
        v/=SQ*1e9;axs[0].barh(i,v,left=left,color=colors[j],height=.5,label=['Private homes','Shared residential','Other city functions'][j] if i==0 else None)
        axs[0].text(left+v/2,i,f'{v:g}',ha='center',va='center',color='white',fontsize=10);left+=v
axs[0].set(yticks=[0,1],yticklabels=['A','B'],xlabel='Billion square feet of usable program',title='Same homes; different shared capacity');axs[0].invert_yaxis()
handles,labels=axs[0].get_legend_handles_labels()
fig.legend(handles,labels,frameon=False,loc='lower left',bbox_to_anchor=(.025,.005),ncol=3,fontsize=9)
axs[1].plot([r['main_tiers'] for r in SENS],[r['width_x_m']/1000 for r in SENS],marker='o',color=TEAL)
for r in SENS:axs[1].annotate(f"{r['width_x_m']/1000:.2f} km",(r['main_tiers'],r['width_x_m']/1000),xytext=(0,12),textcoords='offset points',ha='center')
axs[1].set(xlabel='Main tiers (360 floors held constant)',ylabel='Wing-to-wing width (km)',title='Tier count alone barely changes width here',xticks=[8,12,16],ylim=(0,30));axs[1].margins(x=.18);axs[1].grid(alpha=.15)
fig.tight_layout(rect=(0,.12,1,.95));savefig(fig,'04-program-and-tier-sensitivity')

# Offline 3D viewer: all model data and Plotly code are embedded.
vf=go.Figure();counts=[]
for ci,((r,_),meshes) in enumerate(zip(CASES,MESHES)):
    counts.append(len(meshes))
    for idx,m in enumerate(meshes):
        v=m.vertices/1000;f=m.faces
        vf.add_trace(go.Mesh3d(x=v[:,0],y=v[:,1],z=v[:,2],i=f[:,0],j=f[:,1],k=f[:,2],color=TEAL if ci==0 else GOLD,visible=ci==0,name=f"{r['id']} band {idx+1}",showlegend=False,hovertemplate=f"Case {r['id']} / band {idx+1}<extra></extra>"))
vf.update_layout(title={'text':'Arcology massing 01<br><sup>Concept volume; local courts/streets not yet placed.</sup>','font':{'size':18},'x':.02},scene={'aspectmode':'data','xaxis_title':'East/west km','yaxis_title':'North/south km','zaxis_title':'Height km','xaxis':{'range':[-MAX,MAX]},'yaxis':{'range':[-MAX,MAX]},'zaxis':{'range':[0,1.7]},'camera':{'projection':{'type':'orthographic'},'eye':{'x':1.4,'y':-1.6,'z':.8}}},
    updatemenus=[{'type':'buttons','direction':'left','x':.02,'xanchor':'left','y':1,'yanchor':'top','buttons':[{'label':'A - Housing-led','method':'update','args':[{'visible':[True]*counts[0]+[False]*counts[1]}]},{'label':'B - Shared-city','method':'update','args':[{'visible':[False]*counts[0]+[True]*counts[1]}]}]}],margin={'t':90,'l':0,'r':0,'b':0},height=750)
responsive_script="""
const graph = document.getElementById('{plot_id}');
let lastWidth = 0;
new ResizeObserver(() => {
  const width = graph.clientWidth;
  if (Math.abs(width - lastWidth) < 1) return;
  lastWidth = width;
  Plotly.relayout(graph, {height: Math.max(420, Math.min(750, width * 0.65 + 100))});
}).observe(graph);
"""
vf.write_html(OUT/'massing-viewer.html',include_plotlyjs=True,full_html=True,div_id='arcology-massing-study-01',post_script=responsive_script,config={'displaylogo':False,'responsive':True})

VERS={n:importlib.metadata.version(n) for n in ['shapely','numpy','matplotlib','trimesh','ezdxf','mapbox-earcut','plotly']}
VERS['reportlab']=importlib.metadata.version('reportlab')
RESOURCE=[]
for r,_ in CASES:
    cfg=P['resource_sensitivity'];density=cfg['assumed_concrete_density_kg_per_m3']
    noncompute_gross=r['gross_m2']-COMP['usable_m2']/r['usable_to_gross']
    RESOURCE.append({'case':r['id'],'noncompute_gross_m2':noncompute_gross,
        'slab_proxy':[{'thickness_m':t,'volume_m3':r['gross_m2']*t,'mass_tonnes':r['gross_m2']*t*density/1000} for t in cfg['equivalent_floor_slab_thickness_m']],
        'electricity':[{'kwh_per_noncompute_gross_m2_year':e,'noncompute_twh_year':noncompute_gross*e/1e9,
            'compute_twh_year':COMP['facility_gw']*8.76,'total_twh_year':noncompute_gross*e/1e9+COMP['facility_gw']*8.76,
            'average_gw':noncompute_gross*e/8.76e9+COMP['facility_gw']} for e in cfg['noncompute_electricity_kwh_per_gross_m2_year']]})
RESULTS={'status':'Concept geometry and planning scenarios, not engineering validation','units':'meters and square meters unless named otherwise',
         'cases':[c[0] for c in CASES],'compute_equipment_sensitivity':COMPUTE,'district':D,'summit_access_sensitivity':SUMMIT,
         'tier_sensitivity':SENS,'resource_sensitivity':RESOURCE,'tool_versions':VERS,
         'checks':{'program_totals_reconcile':True,'required_private_area_preserved':True,'wing_overlaps_removed':True,'macro_courtyard_and_street_voids_deducted':True,'local_district_empty_volume_reserved':True,'upper_plates_contained_by_lower':True,'band_meshes_watertight':True,'mesh_volume_matches_geometry':True,'glb_files_reopened':True,'dxf_files_reopened_and_audited':True},
         'not_checked':['complete spatial packing of 5000 districts','structural capacity','foundation settlement','progressive collapse','fire/egress compliance','daylight sufficiency','wind/microclimate','thermal balance','AI workload capacity','regional resource supply','cost feasibility']}
(OUT/'study-results.json').write_text(json.dumps(RESULTS,indent=2)+'\n',encoding='utf-8')
(ROOT/'requirements-resolved.txt').write_text('\n'.join(f'{k}=={v}' for k,v in VERS.items())+'\n')

def pdf():
    target=ROOT.parent/'output'/'pdf';target.mkdir(parents=True,exist_ok=True)
    c=canvas.Canvas(str(target/'arcology-massing-study-01.pdf'),pagesize=(1190.55,841.89),invariant=1);W,H=1190.55,841.89
    c.setTitle('Arcology massing study 01');c.setAuthor('Arcology research / Codex')
    page=0
    def start(title,sub):
        nonlocal page
        page+=1;c.setFillColor(HexColor(INK));c.setFont('Helvetica-Bold',24);c.drawString(42,H-48,title)
        c.setFont('Helvetica',11);c.setFillColor(HexColor(GREY));c.drawString(42,H-70,sub)
        c.setStrokeColor(HexColor('#ccd8d8'));c.line(42,36,W-42,36);c.setFont('Helvetica',9)
        c.drawString(42,22,'ARCOLOGY / MASSING STUDY 01 / 25 SEP 2026 / CONCEPT DESIGN');c.drawRightString(W-42,22,str(page))
    def text(x,y,txt,width=100,size=12,leading=18):
        c.setFont('Helvetica',size);c.setFillColor(HexColor(INK))
        for line in textwrap.wrap(txt,width=width):c.drawString(x,y,line);y-=leading
        return y
    def table(x,y,headers,rows,widths,rowh=29):
        c.setFillColor(HexColor(INK));c.rect(x,y-rowh,sum(widths),rowh,fill=1,stroke=0)
        xx=x;c.setFont('Helvetica-Bold',11);c.setFillColor(HexColor('#ffffff'))
        for h,w in zip(headers,widths):c.drawString(xx+9,y-rowh+10,str(h));xx+=w
        y-=rowh
        for i,row in enumerate(rows):
            c.setFillColor(HexColor('#eff5f2' if i%2==0 else '#ffffff'));c.rect(x,y-rowh,sum(widths),rowh,fill=1,stroke=0)
            c.setFillColor(HexColor(INK));c.setFont('Helvetica',11);xx=x
            for val,w in zip(row,widths):c.drawString(xx+9,y-rowh+10,str(val));xx+=w
            y-=rowh
        return y
    start('A city scaled from its residents','100 million humans + 100 million paired AI + additional AI | 750 sqft of private home space per human')
    c.drawImage(str(OUT/'01-massing-comparison.png'),38,155,width=W-76,height=570,preserveAspectRatio=True,anchor='c')
    text(48,142,'Both cases retain a broad public summit and six subsidiary wings. The courts and open streets are proposed additions to make the internal geometry explicit.',145,12)
    text(48,99,'Case A is the lead. Case B adds shared capacity. These envelopes reconcile program and reserved empty volume; the districts are not yet packed into a complete spatial layout.',145,12)
    c.showPage()
    start('Plans and sections from the same geometry','True scale | Main height 1,536 m | 12 main tiers selected for this iteration; tier count remains adjustable')
    c.drawImage(str(OUT/'02-plans-and-sections.png'),45,72,width=W-90,height=665,preserveAspectRatio=True,anchor='c')
    c.showPage()
    start('The area schedule','Usable program is counted once. Exterior public roofs and unbuilt courtyard volume are separate.')
    a,b=CASES[0][0],CASES[1][0]
    rows=[[k,f"{a['program_usable_m2'][k]/SQ/1e9:.3f}",f"{b['program_usable_m2'][k]/SQ/1e9:.3f}"] for k in a['program_usable_m2']]
    rows += [['TOTAL USABLE',f"{a['usable_m2']/SQ/1e9:.3f}",f"{b['usable_m2']/SQ/1e9:.3f}"],['GROSS AT 70% EFFICIENCY',f"{a['gross_m2']/SQ/1e9:.3f}",f"{b['gross_m2']/SQ/1e9:.3f}"]]
    table(45,735,['Program / billion sqft','A: housing-led','B: shared-city'],rows,[315,145,145],31)
    y=720
    for txt in ['Private homes are fixed by the author. Other category splits are explicit planning allowances, not service standards.',
        'The reserve is unassigned program capacity, not a cost contingency or proof that all services fit.',
        'Shared residential space excludes the shafts and structure already deducted through the 70% gross-to-usable ratio.',
        f"Case A removes {a['overlap_floor_area_removed_m2']/1e9:.2f} billion m2 of wing overlap and {a['void_floor_area_removed_m2']/1e9:.2f} billion m2 at macro openings. It also reserves {a['local_district_void_floor_equivalent_m2']/1e9:.2f} billion m2 of floor-equivalent empty volume for local districts. Those smaller voids are not spatially placed yet.",
        'Compute uses a separate rack-space model. The active fleet and service capability remain unresolved; this ledger uses the 100,000-rack sensitivity.']:
        y=text(690,y,txt,58,12)-24
    c.showPage()
    start('A representative district','20,000 humans + 20,000 paired AI | Case A | 16 courtyard blocks, each with 24 housing floors')
    c.drawImage(str(OUT/'03-district-plan-section.png'),42,177,width=W-84,height=550,preserveAspectRatio=True,anchor='c')
    text(48,155,f"Drawn locally: {D['gross_area_drawn_m2']/1e6:.3f} million m2 gross. Additional citywide facility share: {D['gross_citywide_share_m2']/1e6:.3f} million m2 gross. District total allocation: {D['total_allocated_usable_m2']/SQ/1e6:.1f} million sqft usable.",145,12)
    text(48,108,'The section demonstrates area and access relationships only. Courtyard daylight, actual apartment layouts, supporting-member sizes, fire compartments and service capacity still require design.',145,12)
    c.showPage()
    start('Public access and AI infrastructure','Shared space and resident continuity create demands that must be sized independently of floor-area percentages.')
    rows=[[f"{r['daily_human_visits']:,.0f}",f"{r['peak_arrivals_per_hour']:,.0f}",f"{r['peak_simultaneous_human_visitors']:,.0f}",r['illustrative_express_cars_required']] for r in SUMMIT]
    table(45,725,['Daily summit visits','Peak arrivals / h','Simultaneous visitors','Car-equivalents'],rows,[200,200,225,190],37)
    text(48,582,f"Case A: {a['summit_roof_m2']/1e6:.2f} km2 of summit roof; {a['summit_roof_m2']*.7/1e6:.2f} km2 provisionally public after a 30% access/service allowance. Summit area is not indoor floor area.",140,12)
    text(48,534,'Lift sensitivity: 80 people/car, 12-minute round trip, 80% loading, 20% capacity unavailable. Human visits only; embodied AI and event traffic are additional. This is not a lift or evacuation design.',140,12)
    table(45,450,['Active AI racks','Equipped incl. 20% spare','Usable area (million m2)','Facility demand (GW)'],[[f"{r['active_racks']:,}",f"{r['equipped_racks']:,}",f"{r['usable_m2']/1e6:.2f}",f"{r['facility_gw']:.1f}"] for r in COMPUTE],[200,250,225,235],37)
    text(48,268,'Compute sensitivity: 55 m2 of usable campus space per equipped rack, broken into rack footprint, aisles, cooling, power rooms and maintenance. Active IT is assumed at 230 kW/rack; facility demand uses PUE 1.2. Spare capacity is not counted as fully active load.',140,12)
    text(48,200,'No rack scenario has been shown sufficient for 100 million paired AI plus other residents. Workload, memory, latency, resident continuity and failover determine that requirement.',140,12)
    c.showPage()
    start('Dependencies and construction logic','Operational isolation and structural support are different boundaries.')
    deps=[['Structure','Aligned support paths; movement boundaries','Foundations and any shared lateral system'],['Power and compute','Local protection and protected resident capacity','Generation, cooling and replicated state'],['Air and water','Separate zones, storage and local controls','Heat rejection, makeup and bulk treatment'],['Mobility and food','Local routes, refuge and supply stocks','Other districts, freight and staple imports']]
    table(45,730,['System','District capability to investigate','Continuing dependence'],deps,[155,435,465],48)
    y=461
    for title,txt in [('1 / Build a finite first section','Complete its supports, utilities, public access and essential services before occupancy. Do not rely on an unfinished future wing.'),('2 / Add adjacent sections','Use laterally separated construction fronts where possible. Protect occupied routes and verify load paths for the final build.'),('3 / Connect and extend','Commission each utility and transit connection. Model the loss of a feeder, pipe, chiller, route or network connection.'),('4 / Prove the vertical district','The 24-floor district is a repeatable occupancy unit, not a stackable structural module. Upper districts need continuous support through everything below them.')]:
        c.setFont('Helvetica-Bold',14);c.setFillColor(HexColor(INK));c.drawString(48,y,title);y=text(48,y-24,txt,142,12)-28
    c.showPage()
    start('Material and electricity sensitivities','Arithmetic tied to actual constructed floor area; these are assumptions to challenge, not engineering specifications.')
    rows=[]
    for i,t in enumerate(P['resource_sensitivity']['equivalent_floor_slab_thickness_m']):
        rows.append([f'{t:.2f}',f"{RESOURCE[0]['slab_proxy'][i]['volume_m3']/1e9:.2f}",f"{RESOURCE[0]['slab_proxy'][i]['mass_tonnes']/1e9:.2f}",f"{RESOURCE[1]['slab_proxy'][i]['mass_tonnes']/1e9:.2f}"])
    table(45,727,['Equivalent slab depth (m)','A volume (billion m3)','A mass (billion tonnes)','B mass (billion tonnes)'],rows,[250,250,260,280],36)
    text(48,550,'Uniform-area concrete floor proxy at an assumed density of 2,400 kg/m3. Thicknesses are sensitivity inputs, not sized slabs. Excludes columns, walls, foundations, reinforcement, facade, fit-out and landscape; includes no carbon or embodied-energy estimate. Local empty volume is excluded from the floor quantity.',141,12)
    rows=[]
    for i,e in enumerate(P['resource_sensitivity']['noncompute_electricity_kwh_per_gross_m2_year']):
        rows.append([str(e),f"{RESOURCE[0]['electricity'][i]['total_twh_year']:,.0f}",f"{RESOURCE[0]['electricity'][i]['average_gw']:,.0f}",f"{RESOURCE[1]['electricity'][i]['average_gw']:,.0f}"])
    table(45,447,['Noncompute kWh/m2/year','A total (TWh/year)','A average (GW)','B average (GW)'],rows,[280,245,240,275],36)
    text(48,270,'Electricity proxy applies to noncompute gross area, with compute removed and added back once at 27.6 GW continuously. Intensities are broad test inputs, not calibrated forecasts; annual averages are not peak demand or generation nameplate capacity.',141,12)
    text(48,203,'These results make floor-system choice, demand reduction and regional supply major design drivers. Heating fuels, construction energy, imported goods/food, storage losses, outages and generation siting need separate budgets. Electricity use also requires a heat-rejection strategy.',141,12)
    text(48,121,'PUE definition: US Department of Energy, Cooling Water Efficiency Opportunities for Federal Data Centers. PUE includes compute facility overhead; that cooling electricity must not be added a second time.',141,11)
    c.showPage()
    start('What this study establishes - and what remains open','Geometric consistency is the first gate, not engineering feasibility.')
    c.drawImage(str(OUT/'04-program-and-tier-sensitivity.png'),45,350,width=1095,height=365,preserveAspectRatio=True,anchor='c')
    text(48,326,'Verified: program totals, the residential minimum, macro-void deductions, local empty-volume allowance, vertical plate containment, watertight massing bands, mesh volumes, and CAD export round trips.',142,12)
    text(48,275,'Unresolved: complete district placement, structural capacity, geotechnics, daylight, wind, fire and evacuation, heat rejection, AI service capacity, resources and economics. Reserving empty volume does not prove that every district has sky exposure.',142,12)
    text(48,207,'Recommended next: test one structural section and its daylight/thermal performance, then develop summit access. Do not add detailed architecture until those results constrain the massing.',142,12)
    text(48,151,'Free tools used: Shapely (shapely.readthedocs.io), trimesh (trimesh.org), ezdxf (ezdxf.readthedocs.io), Matplotlib (matplotlib.org), Plotly (plotly.com/python), and ReportLab. Parameters and generated results accompany the drawings.',142,11)
    text(48,90,'Sources: author-confirmed brief; repository snapshot ae7a9df53c8cecbb798f5ebf8d9c1e5b97eb303c; local construction-and-sections study. All new geometry, program splits and equipment scenarios are labeled study assumptions.',142,10)
    c.save()

pdf()
print(json.dumps({'cases':[{k:r[k] for k in ['id','width_x_m','width_y_m','gross_m2','summit_roof_m2','void_floor_area_removed_m2']} for r,_ in CASES], 'district':D,'summit':SUMMIT,'checks':RESULTS['checks']},indent=2))
