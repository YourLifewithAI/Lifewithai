"""FreeCAD's own Python: editable slab prototypes and repeated links, in mm."""
import json,os,traceback,sys
from pathlib import Path
import FreeCAD as App
import Part

def main():
    payload=json.loads(Path(os.environ["ARCOLOGY_INPUT"]).read_text())
    case,p=payload["case"],payload["parameters"];q=case["program"]
    out=Path(os.environ["ARCOLOGY_OUTPUT"])
    doc=App.newDocument("Section_"+case["id"])
    templates=[]; exports=[]
    def ring(name,outer,inner,height):
        base=doc.addObject("Part::Box",name+"Outer");base.Length=outer*1000;base.Width=outer*1000;base.Height=height*1000
        cut=doc.addObject("Part::Box",name+"Void");cut.Length=inner*1000;cut.Width=inner*1000;cut.Height=height*1000+2
        cut.Placement.Base=App.Vector((outer-inner)*500,(outer-inner)*500,-1)
        shape=doc.addObject("Part::Cut",name);shape.Base=base;shape.Tool=cut
        templates.extend([base,cut,shape]);return shape
    housing=ring("HousingSlab",q["outer_m"],q["court_m"],.3)
    civic=ring("CivicSlab",q["podium_m"],q["court_m"],.3)
    for block in case["blocks"]:
        x,y,z=block["center"]
        group=doc.addObject("App::DocumentObjectGroup",block["id"].replace("-","_"))
        for floor in range(28):
            # Floor 27 is the roof, excluded from indoor gross floor area.
            template,side=(civic,q["podium_m"]) if floor<3 else (housing,q["outer_m"])
            link=doc.addObject("App::Link",f"{group.Name}_F{floor:02}")
            link.setLink(template)
            slab_z=z+floor*q["floor_height_m"]-(.3 if floor==27 else 0)
            link.LinkPlacement=App.Placement(App.Vector((x-side/2)*1000,(y-side/2)*1000,slab_z*1000),App.Rotation())
            group.addObject(link);exports.append(link)
    support_templates={}
    for s in case["supports"]:
        h=s["top_z"]
        if h not in support_templates:
            support_templates[h]=ring("Support"+str(len(support_templates)),p["supports"]["reservation_outer_m"],
                                      p["supports"]["reservation_outer_m"]-2*p["supports"]["illustrative_wall_thickness_m"],h)
        w=p["supports"]["reservation_outer_m"]
        obj=doc.addObject("App::Link",s["id"]);obj.setLink(support_templates[h])
        obj.LinkPlacement=App.Placement(App.Vector((s["xy"][0]-w/2)*1000,(s["xy"][1]-w/2)*1000,0),App.Rotation())
        exports.append(obj)
    for item in case["service_decks"]:
        box=doc.addObject("Part::Box",item["id"].replace("-","_"))
        box.Length,box.Width,box.Height=[v*1000 for v in item["size"]]
        box.Placement.Base=App.Vector(*[v*1000 for v in item["origin"]]);exports.append(box)
    for template in templates:template.Visibility=False
    for obj in exports:obj.Visibility=True
    doc.recompute()
    total=sum(obj.Shape.Volume for obj in exports)/1e9
    native=out/(case["id"]+".FCStd");step=out/(case["id"]+".step")
    expected=64*(3*(q["podium_m"]**2-q["court_m"]**2)+25*(q["outer_m"]**2-q["court_m"]**2))*.3
    expected+=sum(s["top_z"] for s in case["supports"])*(p["supports"]["reservation_outer_m"]**2-(p["supports"]["reservation_outer_m"]-2*p["supports"]["illustrative_wall_thickness_m"])**2)
    expected+=sum(b["size"][0]*b["size"][1]*b["size"][2] for b in case["service_decks"])
    if abs(total-expected)>expected*1e-8:raise RuntimeError(f"CAD bodies {total} differ from analytical component sum {expected}")
    doc.saveAs(str(native))
    # Part.export skips App::Link objects in this headless path. Resolve their
    # placed shapes into a temporary compound for exchange, retaining native links.
    exchange=doc.addObject("PartDesign::Feature","ExchangeCompound")
    exchange.Shape=Part.makeCompound([obj.Shape for obj in exports])
    Part.export([exchange],str(step))
    names=[o.Name for o in exports]
    App.closeDocument(doc.Name)
    reopened=App.openDocument(str(native))
    valid=all(reopened.getObject(n).Shape.isValid() for n in names)
    check=sum(reopened.getObject(n).Shape.Volume for n in names)/1e9
    shape=Part.read(str(step))
    if abs(check-total)>max(1e-4,total*1e-9) or abs(shape.Volume/1e9-total)>total*1e-7:
        raise RuntimeError(f"CAD export volume mismatch: {total}, native {check}, STEP {shape.Volume/1e9}")
    expected_bounds=[min(b["origin"][i] for b in case["obstruction_boxes"]) for i in range(3)]+[max(b["origin"][i]+b["size"][i] for b in case["obstruction_boxes"]) for i in range(3)]
    actual_bounds=[shape.BoundBox.XMin/1000,shape.BoundBox.YMin/1000,shape.BoundBox.ZMin/1000,shape.BoundBox.XMax/1000,shape.BoundBox.YMax/1000,shape.BoundBox.ZMax/1000]
    if any(abs(a-b)>1e-5 for a,b in zip(expected_bounds,actual_bounds)) or len(shape.Solids)!=len(exports):
        raise RuntimeError(f"CAD placements/count mismatch: expected {expected_bounds}, got {actual_bounds}")
    result=dict(solver_version=".".join(App.Version()[:3]),native_valid=valid,step_valid=shape.isValid(),
                native_objects=len(names),step_solids=len(shape.Solids),summed_body_volume_m3=total,
                roundtrip_volume_m3=shape.Volume/1e9,
                bounds_m=actual_bounds,
                warning="Summed volumes include intentional slab/core and service-deck intersections; NOT a concrete takeoff. Roof slabs are outside indoor gross program.")
    (out/"result.json").write_text(json.dumps(result,indent=2)+"\n")
    App.closeDocument(reopened.Name)

try:main()
except Exception:
    traceback.print_exc();sys.exit(1)
