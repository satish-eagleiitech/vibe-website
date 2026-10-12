import sharp from "sharp";
import path from "path";
import fs from "fs";

const jobs = [
  ["movies-real-v8.jpg", "movies.png"],
  ["events-real-v8b.jpg", "events.png"],
  ["activities-real-v8.jpg", "activities.png"],
  ["play-real-v8.jpg", "play.png"],
];
const srcDir =
  "C:/Users/Dell/.cursor/projects/c-Users-Dell-Vybe-Web/assets";
const outDir =
  "C:/Users/Dell/Vybe_Web/vibe-web/public/assets/categories";

function dist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

async function process(input, output) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  // Black / near-black background -> transparent (reference-style renders)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (lum < 28) {
      data[i + 3] = 0;
    } else if (lum < 48) {
      data[i + 3] = Math.round(255 * ((lum - 28) / 20));
    }
  }

  const tmpRaw = path.join(outDir, `_${path.basename(output)}.raw.png`);
  await sharp(data, {
    raw: { width: w, height: h, channels: 4 },
  })
    .png()
    .toFile(tmpRaw);

  // Trim to content + padded square
  const { data: d2, info: i2 } = await sharp(tmpRaw)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let minX = i2.width,
    minY = i2.height,
    maxX = 0,
    maxY = 0,
    found = false;
  for (let y = 0; y < i2.height; y++) {
    for (let x = 0; x < i2.width; x++) {
      const a = d2[(y * i2.width + x) * 4 + 3];
      if (a > 20) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!found) {
    fs.renameSync(tmpRaw, output);
    return;
  }
  const pad = Math.round(Math.max(i2.width, i2.height) * 0.08);
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const width = Math.min(i2.width - left, maxX - minX + 1 + pad * 2);
  const height = Math.min(i2.height - top, maxY - minY + 1 + pad * 2);
  const side = Math.max(width, height);
  const tmpOut = output + ".tmp.png";
  await sharp(tmpRaw)
    .extract({ left, top, width, height })
    .resize(side, side, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(tmpOut);
  fs.renameSync(tmpOut, output);
  fs.unlinkSync(tmpRaw);
  console.log("ok", path.basename(output), { side });
}

for (const [s, d] of jobs) {
  await process(path.join(srcDir, s), path.join(outDir, d));
}
