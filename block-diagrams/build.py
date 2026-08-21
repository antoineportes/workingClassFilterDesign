import sys
import glob
import subprocess
from pathlib import Path
from tag_svg import process_svg

def build_file(tex_path):
    tex_file = Path(tex_path).resolve()
    if not tex_file.exists():
        print(f"Error: {tex_file} not found.")
        return

    folder = tex_file.parent
    base_name = tex_file.stem
    xdv_file = folder / f"{base_name}.xdv"
    svg_file = folder / f"{base_name}.svg"

    print(f"Compiling {tex_file.name} -> {svg_file.name}...")

    # \ -> /
    posix_tex_path = tex_file.as_posix()

    # XeLaTeX: .tex -> .xdv
    xelatex_cmd = [
        "xelatex", "-no-pdf", "-interaction=nonstopmode",
        f"-output-directory={folder}",
        f"-jobname={base_name}",
        f"\\def\\pgfsysdriver{{pgfsys-dvisvgm.def}}\\input{{{posix_tex_path}}}"
    ]
    subprocess.run(xelatex_cmd, check=True)

    # dvisvgm: .xdv -> .svg
    dvisvgm_cmd = [
        "dvisvgm", "--no-fonts", "--exact-bbox",
        str(xdv_file), "-o", str(svg_file)
    ]
    subprocess.run(dvisvgm_cmd, check=True)

    # tag_svg.py
    process_svg(svg_file)

    # %temp% CTRL+SHIFT+DEL
    for ext in [".aux", ".log", ".xdv"]:
        temp_file = folder / f"{base_name}{ext}"
        if temp_file.exists():
            temp_file.unlink()

    print(f"Successfully generated: {svg_file.name}\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        build_file(sys.argv[1])
    else:
        tex_files = list(Path(".").rglob("*.tex"))
        print(f"Found {len(tex_files)} TeX file(s) to process...\n")
        for f in tex_files:
            build_file(f)