import sys
import re
from pathlib import Path

def process_svg(filepath):
    path = Path(filepath)
    # get ID prefix
    prefix = path.stem

    with open(filepath, 'r', encoding='utf-8') as f:
        svg = f.read()

    # [black] -> currentColor
    svg = re.sub(r'#000000|#000\b|\bblack\b', 'currentColor', svg, flags=re.IGNORECASE)

    # set ID prefix (declaration)
    svg = re.sub(r'\bid=[\'"]([^\'"]+)[\'"]', rf'id="{prefix}-\1"', svg)

    # set ID prefix (calls)
    svg = re.sub(r'url\([\'"]?#([^\'")]+)[\'"]?\)', rf'url(#{prefix}-\1)', svg)
    svg = re.sub(r'\b(xlink:href|href)=[\'"]#([^\'"]+)[\'"]', rf'\1="#{prefix}-\2"', svg)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(svg)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        process_svg(sys.argv[1])
        print(f"Scoped & Colorized SVG: {sys.argv[1]}")