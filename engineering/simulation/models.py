"""Small SI input contracts for the first engineering adapters."""
import math


def positive(value, label, zero=False):
    if isinstance(value, bool) or not isinstance(value, (float, int)) or not math.isfinite(value):
        raise ValueError(f"{label} must be finite")
    if value < 0 or (value == 0 and not zero):
        raise ValueError(f"{label} must be {'nonnegative' if zero else 'positive'}")
    return value


def vector(value, length, label):
    if not isinstance(value, list) or len(value) != length:
        raise ValueError(f"{label} needs {length} components")
    if any(isinstance(x, bool) or not isinstance(x, (float, int)) or not math.isfinite(x) for x in value):
        raise ValueError(f"{label} must have finite numeric components")
    return value


def validate(tool, job):
    expected = {"freecad": "m", "opensees": "N,m,Pa", "radiance": "m,W/m2/sr"}
    if job.get("schema_version") != 1 or job.get("units") != expected[tool]:
        raise ValueError(f"Expected schema_version 1 and units {expected[tool]!r}")
    if tool == "freecad":
        if job.get("type") != "courtyard_slab":
            raise ValueError("FreeCAD adapter currently supports courtyard_slab")
        for key in ("width", "depth", "thickness", "court_width", "court_depth"):
            positive(job[key], key)
        if job["court_width"] >= job["width"] or job["court_depth"] >= job["depth"]:
            raise ValueError("The centered courtyard must fit strictly inside the slab")
    elif tool == "opensees":
        if job.get("type") != "elastic_frame_2d":
            raise ValueError("Only a linear elastic 2D frame is supported")
        nodes = job["nodes"]
        if len(nodes) < 2 or any(not str(k).isdigit() or int(k) < 1 for k in nodes):
            raise ValueError("Need at least two nodes with positive integer IDs")
        if len({int(k) for k in nodes}) != len(nodes):
            raise ValueError("Node IDs must be unique after integer conversion")
        for tag, xy in nodes.items():
            vector(xy, 2, f"node {tag}")
        if not job["supports"] or not job["elements"] or not job["loads"]:
            raise ValueError("Supports, elements, and nodal loads are required")
        for tag, fix in job["supports"].items():
            if tag not in nodes or len(fix) != 3 or any(type(v) is not int or v not in (0, 1) for v in fix):
                raise ValueError("Support must reference a node and three 0/1 constraints")
        tags = set()
        for element in job["elements"]:
            tag = element["id"]
            if not isinstance(tag, int) or tag < 1 or tag in tags:
                raise ValueError("Element IDs must be unique positive integers")
            tags.add(tag)
            if len(element["nodes"]) != 2 or any(type(v) is not int for v in element["nodes"]):
                raise ValueError("Element endpoints must be two integer node IDs")
            a, b = map(str, element["nodes"])
            if a not in nodes or b not in nodes or nodes[a] == nodes[b]:
                raise ValueError("Element endpoints must exist and have nonzero length")
            for key in ("area_m2", "elastic_modulus_pa", "inertia_m4"):
                positive(element[key], key)
        for tag, force in job["loads"].items():
            if tag not in nodes:
                raise ValueError("Load references an unknown node")
            vector(force, 3, "force [N,N,Nm]")
    else:
        positive(job["sky_radiance"], "sky_radiance")
        if not job["sensors"]:
            raise ValueError("At least one irradiance sensor is required")
        ids = set()
        for sensor in job["sensors"]:
            if not isinstance(sensor["id"], str) or sensor["id"] in ids:
                raise ValueError("Sensor IDs must be unique strings")
            ids.add(sensor["id"])
            vector(sensor["position"], 3, "sensor position")
            n = vector(sensor["normal"], 3, "sensor normal")
            if not math.isclose(sum(v * v for v in n), 1, abs_tol=1e-6):
                raise ValueError("Sensor normals must be unit vectors")
        for box in job.get("opaque_boxes", []):
            vector(box["origin"], 3, "box origin")
            for x in vector(box["size"], 3, "box size"):
                positive(x, "box dimension")
            if not 0 <= box.get("reflectance", 0) <= 1:
                raise ValueError("Opaque diffuse reflectance must be in [0,1]")


def radiance_scene(job):
    validate("radiance", job)
    sky = job["sky_radiance"]
    lines = [f"void glow sky_glow\n0\n0\n4 {sky} {sky} {sky} 0\n",
             "sky_glow source sky\n0\n0\n4 0 0 1 180\n"]
    for i, box in enumerate(job.get("opaque_boxes", [])):
        x, y, z = box["origin"]
        dx, dy, dz = box["size"]
        vertices = [(x, y, z), (x+dx, y, z), (x+dx, y+dy, z), (x, y+dy, z),
                    (x, y, z+dz), (x+dx, y, z+dz), (x+dx, y+dy, z+dz), (x, y+dy, z+dz)]
        r = box.get("reflectance", 0)
        lines.append(f"void plastic mat_{i}\n0\n0\n5 {r} {r} {r} 0 0\n")
        for j, face in enumerate(((3,2,1,0),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7))):
            coords = " ".join(str(c) for index in face for c in vertices[index])
            lines.append(f"mat_{i} polygon box_{i}_{j}\n0\n0\n12 {coords}\n")
    return "\n".join(lines)
