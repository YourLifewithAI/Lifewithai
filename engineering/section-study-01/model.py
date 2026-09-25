"""One geometry and ID model feeds drawings, CAD, sky tests and support/utility ledgers."""
from __future__ import annotations
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SQFT = 0.09290304


def read_inputs():
    p = json.loads((ROOT / "parameters.json").read_text())
    source = json.loads((ROOT / p["source_district"]).read_text())
    return p, source


def program(p, source):
    d, req = source["district"], source["requirements"]
    fixed={"humans":20000,"paired_ai":20000,"private_fraction_of_residential_usable":.8,
           "residential_usable_to_gross":.7,"block_outer_side_m":100,"block_spacing_m":140,"district_pitch_m":560}
    if any(d[k]!=v for k,v in fixed.items()) or source["geometry"]["floor_height_m"]!=4.2672:
        raise ValueError("Update the study geometry, drawings and validation together before changing the inherited district prototype")
    if p["intertier_clearance_floor_increments"]!=3 or len(p["variants"])!=3 or [v["id"] for v in p["variants"]]!=["aligned","stepped","separated"]:
        raise ValueError("This study requires the three named cases and three-increment intertier clearance")
    if d["residential_blocks"] != 16 or d["housing_floors_per_block"] != 24:
        raise ValueError("This study requires the inherited 4x4 / 24-floor prototype")
    if d["local_service_podium_floors"] != 3 or p["supports"]["stations_per_block"] != 8:
        raise ValueError("This study supports three civic floors and eight support stations per block")
    if req["humans"] != 100_000_000 or req["paired_ai"] != 100_000_000 or req["private_home_sqft_per_human"] != 750:
        raise ValueError("Confirmed city population and private housing minimum must be preserved")
    private = d["humans"] * req["private_home_sqft_per_human"] * SQFT
    usable = private / d["private_fraction_of_residential_usable"]
    gross = usable / d["residential_usable_to_gross"]
    ring = gross / 16 / 24
    outer = d["block_outer_side_m"]
    court = math.sqrt(outer**2 - ring)
    civic_usable = d["humans"] * d["local_civic_usable_sqft_per_human"] * SQFT
    civic_gross = civic_usable / d["residential_usable_to_gross"]
    podium = math.sqrt(court**2 + civic_gross / 16 / 3)
    f = source["geometry"]["floor_height_m"]
    if podium >= d["block_spacing_m"] or court >= outer:
        raise ValueError("Courts/blocks do not fit")
    for v in p["variants"]:
        if v["extra_gap_m"] < 0 or v["upper_offset_y_m"] % d["block_spacing_m"] != 0:
            raise ValueError("Upper shifts must align the block grid; gaps must be nonnegative")
    support = p["supports"]
    width, wall = support["reservation_outer_m"], support["illustrative_wall_thickness_m"]
    if not 0 < wall < width / 2 or width >= (outer-court)/2:
        raise ValueError("Support reservations must fit the housing ring and retain a hollow core")
    if min(support["combined_gravity_pressure_pa"], support["illustrative_elastic_modulus_pa"]) <= 0:
        raise ValueError("Load and stiffness must be positive")
    return dict(humans=d["humans"], paired_ai=d["paired_ai"], private_m2=private,
                residential_usable_m2=usable, residential_gross_m2=gross, civic_usable_m2=civic_usable,
                civic_gross_m2=civic_gross, outer_m=outer, court_m=court, podium_m=podium,
                floor_height_m=f, height_m=27*f, tier_pitch_m=(27+p["intertier_clearance_floor_increments"])*f,
                district_pitch_m=d["district_pitch_m"], block_spacing_m=d["block_spacing_m"],
                case_A_citywide_usable_share_m2=d["humans"]*750*SQFT/0.8/0.5-usable-civic_usable,
                case_B_additional_residential_gross_m2=private/0.75/0.7-gross)


def ring_boxes(cx, cy, z, outer, court, height, prefix, category):
    """Non-overlapping four-bar decomposition of a square courtyard ring."""
    o, c = outer/2, court/2
    coords = [(cx-o,cy-o,outer,o-c),(cx-o,cy+c,outer,o-c),
              (cx-o,cy-c,o-c,court),(cx+c,cy-c,o-c,court)]
    return [dict(id=f"{prefix}-{i}", category=category, origin=[x,y,z], size=[w,d,height], reflectance=0)
            for i,(x,y,w,d) in enumerate(coords)]


def build_case(p, source, variant):
    q = program(p, source)
    gap, offset = variant["extra_gap_m"], variant["upper_offset_y_m"]
    dx, dz = q["district_pitch_m"]+gap, q["tier_pitch_m"]
    districts, blocks, boxes, sensors, support_map = [], [], [], [], {}
    for level in range(2):
        for column in range(2):
            did = ("L" if level == 0 else "U") + str(column+1)
            cx, cy, z = (column-.5)*dx, level*offset, level*dz
            districts.append(dict(id=did, center=[cx,cy,z], level=level))
            for iy in range(4):
                for ix in range(4):
                    bx, by = cx+(ix-1.5)*q["block_spacing_m"], cy+(iy-1.5)*q["block_spacing_m"]
                    bid = f"{did}-B{iy*4+ix+1:02}"
                    block = dict(id=bid, district=did, center=[bx,by,z], core_ids=[])
                    blocks.append(block)
                    boxes += ring_boxes(bx,by,z,q["podium_m"],q["court_m"],3*q["floor_height_m"],bid+"-civic","civic")
                    boxes += ring_boxes(bx,by,z+3*q["floor_height_m"],q["outer_m"],q["court_m"],24*q["floor_height_m"],bid+"-housing","housing")
                    # Eight symmetric support/core stations lie wholly inside the housing ring.
                    r = (q["outer_m"]+q["court_m"])/4
                    for n,(a,b) in enumerate(((-1,-1),(0,-1),(1,-1),(1,0),(1,1),(0,1),(-1,1),(-1,0))):
                        sx, sy = bx+a*r, by+b*r
                        key = (round(sx,6), round(sy,6))
                        if key not in support_map:
                            support_map[key] = dict(id=f"S{len(support_map)+1:03}", xy=[sx,sy], blocks=[], districts=[], bottom_occupied_z=z, top_z=z+q["height_m"])
                        support_map[key]["blocks"].append(bid)
                        support_map[key]["districts"].append(did)
                        support_map[key]["top_z"] = max(support_map[key]["top_z"],z+q["height_m"])
                        block["core_ids"].append(support_map[key]["id"])
                    # Horizontal open-space measure at a common local civic-roof level.
                    sensor_height=p["daylight"]["sensor_height_above_local_civic_roof_m"]
                    sensors.append(dict(id=bid+"-court",district=did,block=bid,kind="court",position=[bx,by,z+3*q["floor_height_m"]+sensor_height],normal=[0,0,1]))
                    # Four court-facing and four external facade orientations at three housing levels.
                    for floor in p["daylight"]["facade_floor_indices"]:
                        height=z+(3+floor)*q["floor_height_m"]+sensor_height
                        for direction,(nx,ny) in enumerate(((1,0),(0,1),(-1,0),(0,-1))):
                            for kind in ("inner", "outer"):
                                radius=q["court_m"]/2-.05 if kind == "inner" else q["outer_m"]/2+.05
                                sign=-1 if kind == "inner" else 1
                                sensors.append(dict(id=f"{bid}-{kind}-F{floor:02}-{direction}",district=did,block=bid,kind=kind,floor=floor,
                                                    position=[bx+nx*radius,by+ny*radius,height],normal=[sign*nx,sign*ny,0]))
    supports=list(support_map.values())
    for s in supports:
        # Housing/podium already obstruct sky. Only core segments in unbuilt space are additional opaque boxes.
        occupied=sorted((b["center"][2],b["center"][2]+q["height_m"]) for b in blocks if b["id"] in s["blocks"])
        cursor=0
        for start,end in occupied:
            if start > cursor:
                w=p["supports"]["reservation_outer_m"]
                boxes.append(dict(id=s["id"]+f"-exposed-{cursor}",category="exposed_support",origin=[s["xy"][0]-w/2,s["xy"][1]-w/2,cursor],size=[w,w,start-cursor],reflectance=0))
            cursor=end
    network, bridges, rooms, decks = utilities(p,q,districts)
    boxes += decks
    return dict(id=variant["id"],label=variant["label"],variant=variant,program=q,districts=districts,blocks=blocks,
                obstruction_boxes=boxes,sensors=sensors,supports=supports,utility=network,bridges=bridges,plant_rooms=rooms,service_decks=decks)


def utilities(p,q,districts):
    """Two separated routed spines; geometric Manhattan paths, no hydraulic/electric capacity claim."""
    nodes, edges, bridges, rooms, decks = {}, [], [], [], []
    width, depth = p["utilities"]["bridge_width_m"], p["utilities"]["bridge_depth_m"]
    f, pitch=q["floor_height_m"],q["district_pitch_m"]
    by_id={d["id"]:d for d in districts}
    def edge(eid,a,b,points,role):
        length=sum(math.dist(x,y) for x,y in zip(points,points[1:]))
        edges.append(dict(id=eid,source=a,target=b,points=points,length_m=length,role=role,
                          services=p["utilities"]["services"],isolation_at_both_ends=True))
    for spine,yy in (("A",-q["block_spacing_m"]),("B",q["block_spacing_m"])):
        for d in districts:
            x,y,z=d["center"]
            node=f"{d['id']}-{spine}"
            nodes[node]=dict(id=node,district=None,position=[x,y+yy,z+3*f],role="street service manifold")
            sign=-1 if spine=="A" else 1
            room_center=[x-sign*30,y+sign*1.5*q["block_spacing_m"],z]
            room_id=f"PLANT-{d['id']}-{spine}"
            rw,rd,rh=p["utilities"]["plant_room_size_m"]
            rooms.append(dict(id=room_id,district=d["id"],origin=[room_center[0]-rw/2,room_center[1]-rd/2,z],size=[rw,rd,rh]))
            pos=[room_center[0],room_center[1],z+rh/2]
            nodes[room_id]=dict(id=room_id,district=d["id"],position=pos,role="local plant interface")
            hub=nodes[node]["position"]
            edge(room_id+"-branch",node,room_id,[hub,[pos[0],hub[1],hub[2]],[pos[0],pos[1],hub[2]],pos],"local plant branch")
        for did in ("L1","L2"):
            n=f"{did}-{spine}"
            pos=nodes[n]["position"]
            root=f"ENTRY-{did}-{spine}"
            nodes[root]=dict(id=root,district=None,position=[pos[0],pos[1],0],role="section supply boundary")
            edge(root+"-feed",root,n,[nodes[root]["position"],pos],"section inlet")
        for level in ("L","U"):
            a,b=f"{level}1-{spine}",f"{level}2-{spine}"
            pa,pb=nodes[a]["position"],nodes[b]["position"]
            edge(f"{level}-{spine}-cross",a,b,[pa,pb],"horizontal service spine")
            decks.append(dict(id=f"DECK-{level}-{spine}",category="service_deck",origin=[pa[0],pa[1]-width/2,pa[2]-depth],size=[pb[0]-pa[0],width,depth],reflectance=0))
            # One bridge per spine spans only the district boundary gap plus inherited streets.
            left=by_id[level+"1"]["center"][0]+1.5*q["block_spacing_m"]+q["podium_m"]/2
            right=by_id[level+"2"]["center"][0]-1.5*q["block_spacing_m"]-q["podium_m"]/2
            bridges.append(dict(id=f"BR-{level}-{spine}",category="bridge",origin=[left,pa[1]-width/2,pa[2]-depth],size=[right-left,width,depth],reflectance=0))
        for col in (1,2):
            a,b=f"L{col}-{spine}",f"U{col}-{spine}"
            pa,pb=nodes[a]["position"],nodes[b]["position"]
            # Rise in the lower district street, then jog at the intertier service level.
            corner=[pa[0],pa[1],pb[2]]
            edge(f"V{col}-{spine}",a,b,[pa,corner,pb],"vertical service riser and upper jog")
            if abs(pb[1]-pa[1])>0:
                decks.append(dict(id=f"DECK-JOG-{col}-{spine}",category="service_deck",origin=[pa[0]-width/2,min(pa[1],pb[1]),pb[2]-depth],size=[width,abs(pb[1]-pa[1]),depth],reflectance=0))
    # Internal street routes are centerlines only; bridges outside district boundaries are explicit additions.
    return dict(nodes=nodes,edges=edges),bridges,rooms,decks


def graph_reachable(network, removed_edges=(), removed_nodes=()):
    nodes={k:v for k,v in network["nodes"].items() if k not in removed_nodes}
    reached={k for k,v in nodes.items() if v["role"] == "section supply boundary"}
    changed=True
    while changed:
        changed=False
        for e in network["edges"]:
            a,b=e["source"],e["target"]
            if e["id"] in removed_edges or a not in nodes or b not in nodes:
                continue
            if (a in reached) != (b in reached):
                reached.update((a,b)); changed=True
    return {d for d in ("L1","L2","U1","U2") if any(k in reached and v["district"]==d for k,v in nodes.items())}


def ledger(case,p):
    q=case["program"]
    supports=case["supports"]
    network=case["utility"]
    minx=min(d["center"][0]-q["district_pitch_m"]/2 for d in case["districts"])
    maxx=max(d["center"][0]+q["district_pitch_m"]/2 for d in case["districts"])
    miny=min(d["center"][1]-q["district_pitch_m"]/2 for d in case["districts"])
    maxy=max(d["center"][1]+q["district_pitch_m"]/2 for d in case["districts"])
    edge_survivors=[len(graph_reachable(network,[e["id"]])) for e in network["edges"]]
    plant_failures=[len(graph_reachable(network,removed_nodes=[n])) for n,v in network["nodes"].items() if v["role"]=="local plant interface"]
    return dict(humans=4*q["humans"],paired_ai=4*q["paired_ai"],private_home_sqft=4*q["private_m2"]/SQFT,
                private_home_m2=4*q["private_m2"],residential_gross_m2=4*q["residential_gross_m2"],
                civic_usable_m2=4*q["civic_usable_m2"],civic_gross_m2=4*q["civic_gross_m2"],
                footprint_envelope_m2=(maxx-minx)*(maxy-miny),extent_m=[maxx-minx,maxy-miny,q["tier_pitch_m"]+q["height_m"]],
                support_axes=len(supports),shared_lower_upper_axes=sum(len(s["blocks"])==2 for s in supports),
                upper_only_axes=sum(s["bottom_occupied_z"]>0 for s in supports),
                unbraced_edge_height_to_upper_district_m=max(s["bottom_occupied_z"] for s in supports),
                support_axis_length_m=sum(s["top_z"] for s in supports),
                support_reserved_floor_fraction=8*p["supports"]["reservation_outer_m"]**2/((q["outer_m"]**2-q["court_m"]**2)),
                bridge_plan_area_m2=sum(b["size"][0]*b["size"][1] for b in case["bridges"]),
                service_deck_component_area_m2=sum(b["size"][0]*b["size"][1] for b in case["service_decks"]),
                longest_bridge_span_m=max(b["size"][0] for b in case["bridges"]),
                routed_service_corridor_length_m=sum(e["length_m"] for e in network["edges"]),
                service_route_length_note="A+B centerline corridor total; not multiplied by five services and not a pipe/cable takeoff",
                pressure_zones_per_riser=math.ceil((q["tier_pitch_m"]+q["height_m"])/p["utilities"]["water_pressure_zone_max_height_m"]),
                single_edge_loss_min_districts_reachable=min(edge_survivors),single_plant_interface_loss_min_districts_reachable=min(plant_failures),
                A_spine_loss_districts_reachable=len(graph_reachable(network,removed_nodes=[n for n in network["nodes"] if n.endswith("-A")])),
                all_section_entries_lost_districts_reachable=len(graph_reachable(network,removed_nodes=[n for n in network["nodes"] if n.startswith("ENTRY")])),
                autonomy_hours="Unspecified: no storage/equipment demand balance yet")
