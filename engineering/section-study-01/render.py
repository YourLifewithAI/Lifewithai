"""Coordinated analytical drawings and an offline geometry/sky-access viewer."""
import json
import math
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from matplotlib.colors import Normalize
from matplotlib.cm import ScalarMappable
from matplotlib.ticker import PercentFormatter
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import plotly.graph_objects as go

INK="#243d43";GREEN="#7bad9c";UPPER="#397d78";GOLD="#d4aa66";BLUE="#326faa";ORANGE="#c66e32";PAPER="#faf9f4"
plt.rcParams.update({"font.family":"DejaVu Sans","font.size":10,"axes.labelcolor":INK,"text.color":INK,"axes.edgecolor":"#91a6a5","figure.facecolor":PAPER,"axes.facecolor":PAPER,"savefig.facecolor":PAPER})

def save(fig,out,name):
    fig.savefig(out/f"{name}.png",dpi=165,bbox_inches="tight")
    fig.savefig(out/f"{name}.svg",bbox_inches="tight")
    plt.close(fig)

def frame(ax):
    ax.set_aspect("equal");ax.set_xlim(-655,655);ax.set_ylim(-300,480)
    ax.set_xlabel("X / metres");ax.set_ylabel("Y / metres");ax.grid(alpha=.12)

def ring(ax,x,y,outer,court,color,alpha=1,lw=.5):
    ax.add_patch(Rectangle((x-outer/2,y-outer/2),outer,outer,facecolor=color,edgecolor=INK,lw=lw,alpha=alpha))
    ax.add_patch(Rectangle((x-court/2,y-court/2),court,court,facecolor=PAPER,edgecolor=INK,lw=lw))

def vertices(item):
    x,y,z=item["origin"];w,d,h=item["size"]
    return np.array([[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z],
                     [x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]])

FACES=((0,1,2,3),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7))

def comparison(cases,results,p,out):
    fig=plt.figure(figsize=(16,9));gs=fig.add_gridspec(2,3,height_ratios=[1.45,1],hspace=.06,wspace=.03)
    for i,case in enumerate(cases):
        ax=fig.add_subplot(gs[0,i],projection="3d")
        faces=[];colors=[]
        for item in case["obstruction_boxes"]:
            verts=vertices(item)
            cat=item["category"]
            color=GOLD if cat=="civic" else BLUE if cat=="service_deck" else INK if cat=="exposed_support" else GREEN
            faces.extend(verts[list(f)] for f in FACES);colors.extend([color]*len(FACES))
        # Sort individual faces across the whole scene: separate box collections
        # can incorrectly paint rear walls over courtyard openings.
        ax.add_collection3d(Poly3DCollection(faces,facecolors=colors,edgecolors=INK,linewidths=.10,alpha=1,shade=True))
        ax.set(xlim=(-655,655),ylim=(-300,440),zlim=(0,260));ax.set_box_aspect((1310,740,260))
        ax.view_init(elev=32,azim=-66);ax.set_axis_off();ax.set_title(case["label"],fontsize=19,pad=2)
        r=results[case["id"]];l=r["ledger"];d=r["daylight"]["groups"]
        text=[("Private homes",f"{l['private_home_sqft']/1e6:.0f} million sqft"),
              ("Cell envelope footprint",f"{l['footprint_envelope_m2']/1e6:.3f} km²"),
              ("Lower court sky access",f"{d['L-court']['mean']:.1%}"),
              ("Lower inward facade sky",f"{d['L-inner']['mean']:.1%}"),
              ("Upper-only support axes",str(l['upper_only_axes'])),
              ("Longest boundary crossing",f"{l['longest_bridge_span_m']:.1f} m"),
              ("Routed A + B services",f"{l['routed_service_corridor_length_m']/1000:.2f} km")]
        table_ax=fig.add_subplot(gs[1,i]);table_ax.axis("off")
        table=table_ax.table(cellText=text,colWidths=[.65,.35],cellLoc="left",bbox=[.03,.12,.94,.86])
        table.auto_set_font_size(False);table.set_fontsize(10)
        for (row,col),cell in table.get_celld().items():
            cell.set_edgecolor("#dce3df");cell.set_facecolor("#edf3ef" if row%2==0 else PAPER)
            if col==1:cell.set_text_props(weight="bold",color=INK)
    fig.suptitle("Four districts, one housing commitment",fontsize=24,y=.99)
    fig.text(.5,.94,"80,000 humans + 80,000 paired AI | 750 sqft private homes per human | Additional AI unquantified",ha="center",fontsize=11)
    fig.text(.5,.035,"True geometry proportions. Sky access is an exterior geometric measure; structural safety and indoor daylight remain unresolved.",ha="center",fontsize=10)
    save(fig,out,"comparison")

def plans(cases,results,p,out):
    fig,axes=plt.subplots(2,3,figsize=(17,10));fig.subplots_adjust(top=.89,bottom=.10,hspace=.24,wspace=.20)
    for col,case in enumerate(cases):
        q=case["program"]
        for row,prefix in enumerate(("L","U")):
            ax=axes[row,col]
            for d in case["districts"]:
                if not d["id"].startswith(prefix):continue
                x,y,z=d["center"];pitch=q["district_pitch_m"]
                ax.add_patch(Rectangle((x-pitch/2,y-pitch/2),pitch,pitch,facecolor="none",edgecolor="#9fac9e",ls="--",lw=.8))
                ax.text(x,y+pitch/2+10,d["id"],ha="center",fontsize=10,weight="bold")
            for b in case["blocks"]:
                if b["district"].startswith(prefix):
                    x,y,z=b["center"];ring(ax,x,y,q["outer_m"],q["court_m"],GREEN if row==0 else UPPER)
            for s in case["supports"]:
                if any(d.startswith(prefix) for d in s["districts"]):
                    w=p["supports"]["reservation_outer_m"]
                    ax.add_patch(Rectangle((s["xy"][0]-w/2,s["xy"][1]-w/2),w,w,facecolor=INK,linewidth=0))
            for e in case["utility"]["edges"]:
                if e["role"]=="horizontal service spine" and e["source"].startswith(prefix):
                    pts=np.array(e["points"]);ax.plot(pts[:,0],pts[:,1],color=BLUE if "-A" in e["source"] else ORANGE,lw=2)
            frame(ax);ax.set_title(case["label"]+" / "+("lower" if row==0 else "upper"),fontsize=15)
    fig.suptitle("Plans: equal floor program, different placement",fontsize=23,y=.97)
    fig.text(.5,.925,"Housing floor footprints with 59.3 m open courts. Dark squares = 8 m support/core reservations. Blue/orange = A/B service spines.",ha="center",fontsize=10)
    fig.text(.5,.025,"Dashed cells are planning envelopes, not solid platforms. Civic rings are wider than housing rings. Plant rooms fit within civic floor area.",ha="center",fontsize=10)
    save(fig,out,"plans")

def sections(cases,results,p,out):
    fig,axes=plt.subplots(3,1,figsize=(15,12));fig.subplots_adjust(top=.91,bottom=.09,hspace=.33)
    for ax,case in zip(axes,cases):
        q=case["program"];district=case["districts"][0];xcut=district["center"][0]+q["block_spacing_m"]/2
        for item in case["obstruction_boxes"]:
            x,y,z=item["origin"];w,d,h=item["size"]
            if x-1e-6<=xcut<=x+w+1e-6:
                color=GOLD if item["category"]=="civic" else BLUE if item["category"]=="service_deck" else GREEN
                ax.add_patch(Rectangle((y,z),d,h,facecolor=color,edgecolor=INK,lw=.5))
        for block in case["blocks"]:
            if abs(block["center"][0]-xcut)>.1:continue
            x,y,z=block["center"]
            for floor in range(28):
                outer=q["podium_m"] if floor<3 else q["outer_m"]
                for a,b in ((-outer/2,-q["court_m"]/2),(q["court_m"]/2,outer/2)):
                    ax.plot([y+a,y+b],[z+floor*q["floor_height_m"]]*2,color=PAPER,lw=.5)
        for s in case["supports"]:
            if abs(s["xy"][0]-xcut)<.01:
                ax.plot([s["xy"][1]]*2,[0,s["top_z"]],color=INK,lw=1.6)
                ax.plot(s["xy"][1],0,"^",color=INK,ms=5)
        ax.axhline(q["tier_pitch_m"],color=BLUE,lw=.7,ls="--")
        ax.set(xlim=(-300,440),ylim=(-10,260),xlabel="Y / metres",ylabel="Z / metres")
        ax.set_aspect("equal");ax.grid(alpha=.12)
        ax.set_title(f"{case['label']} | N–S cut through one block column",loc="left",fontsize=15)
        if case["id"]=="stepped":
            ax.annotate("Upper edge supports need\na braced structural solution",xy=(350,65),xytext=(200,52),ha="center",fontsize=10,
                        arrowprops=dict(arrowstyle="->",color=INK),bbox=dict(facecolor=PAPER,edgecolor="none",alpha=.9))
    fig.suptitle("Section: keep courts open and follow supports to ground",fontsize=23,y=.975)
    fig.text(.5,.937,"27 occupied floor levels per district + a roof | Upper base 128.0 m | Overall occupied envelope 243.2 m",ha="center",fontsize=11)
    fig.text(.5,.032,"Same scale in all cuts. Sections pass through one district column; the separated case differs along X and therefore shares the aligned N–S profile.",ha="center",fontsize=10)
    fig.text(.5,.014,"Dark vertical lines show support continuity only. They do not establish capacity, stability, foundations or lateral resistance.",ha="center",fontsize=10)
    save(fig,out,"sections")

def sky_maps(cases,results,p,out):
    fig,axes=plt.subplots(2,3,figsize=(17,10));fig.subplots_adjust(top=.90,bottom=.15,wspace=.2,hspace=.3)
    norm=Normalize(0,.12);cmap=plt.get_cmap("viridis")
    for col,case in enumerate(cases):
        q=case["program"];sensors=results[case["id"]]["daylight"]["sensors"]
        for row,kind in enumerate(("court","inner")):
            ax=axes[row,col]
            for b in case["blocks"]:
                if b["district"].startswith("L"):
                    x,y,z=b["center"];ring(ax,x,y,q["outer_m"],q["court_m"],"#dfe5e0",lw=.35)
            selected=[s for s in sensors if s["district"].startswith("L") and s["kind"]==kind and (kind=="court" or s["floor"]==0)]
            xy=np.array([s["position"] for s in selected])
            ax.scatter(xy[:,0],xy[:,1],c=[s["sky_fraction"] for s in selected],s=40 if row==0 else 18,cmap=cmap,norm=norm,edgecolors=INK,linewidths=.3)
            frame(ax);ax.set_title(case["label"]+" / "+("lower courts" if row==0 else "lowest inward facades"),fontsize=14)
    cax=fig.add_axes([.30,.085,.4,.025]);bar=fig.colorbar(ScalarMappable(norm=norm,cmap=cmap),cax=cax,orientation="horizontal",format=PercentFormatter(xmax=1))
    bar.set_label("Visible-sky irradiance / unobstructed irradiance on the same orientation",labelpad=3)
    fig.suptitle("A vertical opening is only part of daylight access",fontsize=23,y=.975)
    fig.text(.5,.935,"Matched virtual probes at housing entry level; uniform sky; black obstructions; 16,384 ambient divisions. Same 0–12% scale.",ha="center",fontsize=10)
    fig.text(.5,.012,"No glazing, room depth, direct sun or annual weather is modeled. The maps do not measure interior light levels or natural ventilation.",ha="center",fontsize=10)
    save(fig,out,"sky-maps")

def utilities(cases,results,p,out):
    fig,axes=plt.subplots(1,3,figsize=(17,8));fig.subplots_adjust(top=.87,bottom=.25,wspace=.18)
    for ax,case in zip(axes,cases):
        q=case["program"]
        for d in case["districts"][:2]:
            x,y,z=d["center"];pitch=q["district_pitch_m"]
            ax.add_patch(Rectangle((x-pitch/2,y-pitch/2),pitch,pitch,facecolor="#edf1ea",edgecolor=INK,lw=.7))
            ax.text(x,245,d["id"],ha="center",weight="bold")
        for e in case["utility"]["edges"]:
            if not (e["source"].startswith(("L","ENTRY-L")) or "PLANT-L" in e["source"]):continue
            pts=np.array(e["points"]);color=BLUE if "-A" in e["source"] else ORANGE
            ax.plot(pts[:,0],pts[:,1],color=color,lw=1.8,ls="--" if e["role"].startswith("vertical") else "-")
        for room in case["plant_rooms"]:
            if room["district"].startswith("L"):
                x,y,z=room["origin"];w,d,h=room["size"]
                ax.add_patch(Rectangle((x,y),w,d,facecolor=BLUE if room["id"].endswith("-A") else ORANGE))
        frame(ax);ax.set_title(case["label"],fontsize=18)
    fig.suptitle("Service districts: local isolation, shared supply boundaries",fontsize=23,y=.98)
    fig.text(.5,.92,"Two spatially separated A/B paths. Electrical, water, cooling supply/return and data share the corridor diagram, not interchangeable capacity.",ha="center",fontsize=10)
    fig.text(.07,.20,"Graph checks in every arrangement",fontsize=14,weight="bold")
    fig.text(.07,.13,"One edge or local plant interface lost: 4/4 districts remain connected\nEntire A path lost: 4/4 connected through B | All section entries lost: 0/4 connected",fontsize=11,linespacing=1.6)
    fig.text(.07,.04,"A surviving line is not proof of capacity or supply independence. Backup duration, pressure, protection, heat rejection and sewage need separate models.\nStepped routes include upper jogs (dashed); their supporting deck layout is still unresolved. Room boxes are reserved within civic floor area.",fontsize=10,linespacing=1.6)
    save(fig,out,"utilities")

def mesh_trace(items,name,color,visible=True):
    points=[];triangles=[]
    for item in items:
        verts=vertices(item);start=len(points);points.extend(verts)
        for a,b,c,d in FACES:triangles.extend([(start+a,start+b,start+c),(start+a,start+c,start+d)])
    xyz=np.asarray(points);tri=np.asarray(triangles)
    if len(points)==0:return go.Mesh3d(name=name,x=[],y=[],z=[],visible=visible)
    return go.Mesh3d(x=xyz[:,0],y=xyz[:,1],z=xyz[:,2],i=tri[:,0],j=tri[:,1],k=tri[:,2],name=name,color=color,visible=visible,
                     flatshading=True,showlegend=True,hoverinfo="name",lighting=dict(ambient=.65,diffuse=.7))

def viewer(cases,results,p,out):
    fig=go.Figure();groups=[]
    for case in cases:
        start=len(fig.data);show=case["id"]=="aligned";zsplit=case["program"]["tier_pitch_m"]
        for level,label in ((0,"Lower"),(1,"Upper")):
            for category,color in (("housing",GREEN if level==0 else UPPER),("civic",GOLD)):
                items=[b for b in case["obstruction_boxes"] if b["category"]==category and int(b["origin"][2]>=zsplit)==level]
                fig.add_trace(mesh_trace(items,label+" "+category,color,show))
        for cat,color in (("exposed_support",INK),("service_deck",BLUE)):
            fig.add_trace(mesh_trace([b for b in case["obstruction_boxes"] if b["category"]==cat],cat.replace("_"," ").title(),color,show))
        for spine,color in (("A",BLUE),("B",ORANGE)):
            xyz=[[],[],[]]
            for e in case["utility"]["edges"]:
                if not e["source"].endswith("-"+spine):continue
                for point in e["points"]:
                    for j in range(3):xyz[j].append(point[j])
                for j in range(3):xyz[j].append(None)
            fig.add_trace(go.Scatter3d(x=xyz[0],y=xyz[1],z=xyz[2],mode="lines",name=f"Utility {spine}",line=dict(color=color,width=5),visible=show,hoverinfo="name"))
        sensors=[s for s in results[case["id"]]["daylight"]["sensors"] if s["kind"]=="court"]
        xyz=np.array([s["position"] for s in sensors])
        fig.add_trace(go.Scatter3d(x=xyz[:,0],y=xyz[:,1],z=xyz[:,2],mode="markers",name="Court sky sensors",visible=show,
                                  marker=dict(size=3,color=[s["sky_fraction"] for s in sensors],colorscale="Viridis",cmin=0,cmax=.6),
                                  text=[f"{s['id']}: sky access {s['sky_fraction']:.1%}" for s in sensors],hoverinfo="text"))
        groups.append((start,len(fig.data)))
    buttons=[]
    for case,(a,b) in zip(cases,groups):
        buttons.append(dict(label=case["label"],method="update",args=[{"visible":[a<=i<b for i in range(len(fig.data))]},
                        {"title":dict(text=f"Four districts / {case['label']}")}]))
    fig.update_layout(title=dict(text="Four districts / Aligned",x=.02),height=650,paper_bgcolor=PAPER,
                      font=dict(family="Arial",color=INK),margin=dict(l=0,r=0,b=155,t=100),
                      legend=dict(orientation="h",x=0,y=-.06,font=dict(size=11)),
                      updatemenus=[dict(type="buttons",direction="right",x=0,xanchor="left",y=1.08,buttons=buttons)],
                      scene=dict(aspectmode="data",xaxis_title="X / m",yaxis_title="Y / m",zaxis_title="Z / m",
                                 xaxis=dict(range=[-655,655]),yaxis=dict(range=[-300,440]),zaxis=dict(range=[0,260]),
                                 camera=dict(eye=dict(x=1.9,y=-2.7,z=1.6),projection=dict(type="orthographic"))),uirevision="preserve-camera")
    html=fig.to_html(full_html=True,include_plotlyjs=True,config=dict(responsive=True,displaylogo=False,modeBarButtonsToRemove=["sendDataToCloud"]))
    note='<div style="font:16px/1.5 Arial;padding:20px 32px;background:#faf9f4;color:#243d43"><b>Use the legend to hide upper buildings and inspect lower courts.</b> Drag to rotate; scroll to zoom. Geometry is drawn at true proportions. Colored building bands are enclosing volumes; editable CAD contains floor slabs and support envelopes. Sky markers show geometric exposure, not room light levels. Structural safety, natural ventilation and service capacity remain unresolved. <a href="report.md">Read the study</a>.</div>'
    (out/"viewer.html").write_text(html.replace("<body>","<body>"+note),encoding="utf-8")

def render(cases,results,p,out):
    comparison(cases,results,p,out)
    plans(cases,results,p,out)
    sections(cases,results,p,out)
    sky_maps(cases,results,p,out)
    utilities(cases,results,p,out)
    viewer(cases,results,p,out)
