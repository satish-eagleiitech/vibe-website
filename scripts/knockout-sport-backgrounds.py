"""Remove near-white studio backdrops so equipment sits on dark cards."""
from pathlib import Path

from PIL import Image

root = Path(r"C:\Users\Dell\Vybe_Web\vibe-web\public\images\explore")

# Scene photos keep their own environments. These are studio shots on white.
jobs = {
    "events": None,
    "activities": None,
}


def dist(a, b):
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def knockout(path: Path) -> Image.Image:
    im = Image.open(path).convert("RGBA")
    pixels = im.load()
    w, h = im.size
    bg = (255, 255, 255)
    thresh = 26

    visited = bytearray(w * h)
    stack = []
    for x in range(w):
        stack.append((x, 0))
        stack.append((x, h - 1))
    for y in range(h):
        stack.append((0, y))
        stack.append((w - 1, y))

    while stack:
        x, y = stack.pop()
        i = x * h + y
        if x < 0 or y < 0 or x >= w or y >= h or visited[i]:
            continue
        r, g, b, _a = pixels[x, y]
        d = dist((r, g, b), bg)
        if d > thresh:
            continue
        visited[i] = 1
        if d < thresh * 0.55:
            pixels[x, y] = (r, g, b, 0)
        else:
            alpha = int(255 * ((d - thresh * 0.55) / (thresh * 0.45)))
            pixels[x, y] = (r, g, b, max(0, min(255, alpha)))
        stack.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    # Studio grids are sparse pale dots. Solid white parts of the object stay.
    opaque = [0] * ((w + 1) * (h + 1))

    def at(x, y):
        return y * (w + 1) + x

    for y in range(h):
        row = 0
        for x in range(w):
            if pixels[x, y][3] > 40:
                row += 1
            opaque[at(x + 1, y + 1)] = opaque[at(x + 1, y)] + row

    radius = 10
    need = 70
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 40:
                continue
            chroma = max(r, g, b) - min(r, g, b)
            # Sparse gray studio dots only. Dense whites and colored equipment stay.
            if chroma > 26 or min(r, g, b) < 150:
                continue
            x0 = max(0, x - radius)
            y0 = max(0, y - radius)
            x1 = min(w - 1, x + radius)
            y1 = min(h - 1, y + radius)
            total = (
                opaque[at(x1 + 1, y1 + 1)]
                - opaque[at(x0, y1 + 1)]
                - opaque[at(x1 + 1, y0)]
                + opaque[at(x0, y0)]
            )
            if total < need:
                pixels[x, y] = (r, g, b, 0)

    return im


for folder, names in jobs.items():
    src_dir = root / folder
    out_dir = src_dir / "on-dark"
    out_dir.mkdir(parents=True, exist_ok=True)
    targets = (
        sorted(p.stem for p in src_dir.glob("*.jpg")) if names is None else names
    )
    for name in targets:
        src = src_dir / f"{name}.jpg"
        if not src.exists():
            print("missing", src)
            continue
        result = knockout(src)
        out = out_dir / f"{name}.png"
        result.save(out, "PNG", optimize=True)
        hist = result.getchannel("A").histogram()
        total = result.size[0] * result.size[1]
        print(f"{folder}/{name}: transparent%={round(100 * sum(hist[:16]) / total, 1)}")

print("done")
