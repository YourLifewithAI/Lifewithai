"""Local, checksum-pinned native runtimes. No administrator/global install needed."""
from __future__ import annotations

import hashlib
import json
import os
import platform
import shutil
import subprocess
import tarfile
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LOCK = ROOT / "native-tools.lock.json"


def platform_key():
    machine = platform.machine().lower()
    arch = {"amd64": "x86_64", "aarch64": "arm64"}.get(machine, machine)
    return f"{platform.system().lower()}-{arch}"


def digest(path, text=False):
    if text:
        return hashlib.sha256(Path(path).read_bytes().replace(b"\r\n", b"\n")).hexdigest()
    with Path(path).open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def spec(name):
    tool = json.loads(LOCK.read_text())["tools"][name]
    key = platform_key()
    if key not in tool["assets"]:
        raise RuntimeError(f"No pinned {name} release for {key}; see README platform limits.")
    return tool, tool["assets"][key]


def installation(name):
    tool, _ = spec(name)
    return ROOT / ".tools" / name / tool["version"] / platform_key()


def safe_member(root, name):
    target = (root / name).resolve()
    if not target.is_relative_to(root.resolve()):
        raise ValueError(f"Archive member escapes installation: {name}")
    return target


def extract(archive, destination, kind):
    destination.mkdir(parents=True, exist_ok=True)
    if kind == "zip":
        with zipfile.ZipFile(archive) as bundle:
            for item in bundle.infolist():
                safe_member(destination, item.filename)
            bundle.extractall(destination)
            if os.name != "nt":
                for item in bundle.infolist():
                    mode = item.external_attr >> 16
                    if mode and not item.is_dir():
                        safe_member(destination, item.filename).chmod(mode & 0o777)
    elif kind == "7z":
        # The official FreeCAD archive uses BCJ2, unsupported by Python's lzma.
        # 7zr is the official, portable, public-domain 7z-only extractor.
        install("7zr")
        extractor = installation("7zr") / "7zr.exe"
        subprocess.run([str(extractor), "x", str(archive), f"-o{destination}", "-y"],
                       check=True, stdout=subprocess.DEVNULL, timeout=900)
    elif kind == "exe-portable":
        shutil.copyfile(archive, destination / archive.name)
    elif kind == "tar.gz":
        with tarfile.open(archive) as bundle:
            bundle.extractall(destination, filter="data")
    elif kind == "appimage":
        archive.chmod(0o755)
        subprocess.run([str(archive), "--appimage-extract"], cwd=destination,
                       check=True, stdout=subprocess.DEVNULL, timeout=600)
    elif kind == "dmg":
        mount = destination / "mount"
        mount.mkdir(exist_ok=True)
        subprocess.run(["hdiutil", "attach", str(archive), "-readonly", "-nobrowse",
                        "-mountpoint", str(mount)], check=True, timeout=120)
        try:
            apps = list(mount.glob("*.app"))
            if len(apps) != 1:
                raise RuntimeError("Expected one FreeCAD application in the official disk image.")
            shutil.copytree(apps[0], destination / apps[0].name, symlinks=True,
                            dirs_exist_ok=True)
        finally:
            subprocess.run(["hdiutil", "detach", str(mount)], check=True, timeout=120)
    else:
        raise ValueError(f"Unsupported archive format {kind}")


def install(name):
    tool, asset = spec(name)
    destination = installation(name)
    receipt = destination / "receipt.json"
    if receipt.exists() and json.loads(receipt.read_text()).get("archive_sha256") == asset["sha256"]:
        print(f"{name}: pinned archive already installed", flush=True)
        return
    cache = ROOT / ".cache" / "downloads"
    cache.mkdir(parents=True, exist_ok=True)
    archive = cache / asset["url"].rsplit("/", 1)[1]
    if not archive.exists() or digest(archive) != asset["sha256"]:
        partial = archive.with_suffix(archive.suffix + ".partial")
        print(f"{name}: downloading {asset['size_bytes'] / 1e6:.0f} MB from official release", flush=True)
        request = urllib.request.Request(asset["url"], headers={"User-Agent": "ArcologySimulation/0.1"})
        with urllib.request.urlopen(request, timeout=90) as response, partial.open("wb") as output:
            shutil.copyfileobj(response, output, length=1024 * 1024)
        if partial.stat().st_size != asset["size_bytes"] or digest(partial) != asset["sha256"]:
            raise RuntimeError(f"{name}: download checksum/size mismatch; extraction refused")
        partial.replace(archive)
    print(f"{name}: extracting verified archive", flush=True)
    extract(archive, destination, asset["format"])
    # Radiance release ZIPs wrap the actual portable distribution in a tar.gz.
    for nested in list(destination.rglob("*.tar.gz")):
        extract(nested, nested.parent, "tar.gz")
    receipt.write_text(json.dumps({"tool": name, "version": tool["version"],
                                  "platform": platform_key(), "url": asset["url"],
                                  "archive_sha256": asset["sha256"]}, indent=2) + "\n")
    print(f"{name}: installed in {destination.relative_to(ROOT)}", flush=True)


def executable(name, program=None):
    root = installation(name)
    receipt = root / "receipt.json"
    if not receipt.exists():
        raise RuntimeError(f"{name} is missing. Run: python engineering/simulation/run.py install {name}")
    if json.loads(receipt.read_text())["archive_sha256"] != spec(name)[1]["sha256"]:
        raise RuntimeError(f"{name}: stale runtime receipt; reinstall the pinned release")
    names = {"freecad": ["FreeCADCmd", "freecadcmd", "freecadcmd-python3"],
             "radiance": [program or "rtrace"], "energyplus": ["energyplus"]}[name]
    wanted = {n.lower() + (".exe" if os.name == "nt" else "") for n in names}
    matches = [p for p in root.rglob("*") if p.is_file() and p.name.lower() in wanted]
    if name == "freecad" and len(matches) > 1:
        # Windows portable releases include both the environment-setting launcher
        # at the package root and the underlying bin executable. Use the launcher.
        depth = min(len(p.relative_to(root).parts) for p in matches)
        matches = [p for p in matches if len(p.relative_to(root).parts) == depth]
    if len(matches) != 1:
        raise RuntimeError(f"{name}: expected one executable {wanted}, found {len(matches)} in {root}")
    return matches[0]


def environment(name):
    env = os.environ.copy()
    if name == "freecad":
        env["QT_QPA_PLATFORM"] = "offscreen"
    if name == "radiance":
        libs = sorted({str(p.parent) for p in installation(name).rglob("rayinit.cal")})
        env["RAYPATH"] = os.pathsep.join([".", *libs])
        env["PATH"] = str(executable(name).parent) + os.pathsep + env.get("PATH", "")
    return env


if __name__ == "__main__":
    import sys
    for name in sys.argv[1:] or ["radiance", "energyplus", "freecad"]:
        install(name)
