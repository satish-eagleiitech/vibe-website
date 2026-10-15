import sharp from "sharp";
import path from "path";

const dir = path.resolve("public/assets/categories");

// Movies: full-bleed resize of flat art (already edge-to-edge navy)
await sharp(path.join(dir, "movies-3d-flat.jpg"))
  .resize(1600, 900, { fit: "cover", position: "right" })
  .jpeg({ quality: 92 })
  .toFile(path.join(dir, "movies-card.jpg"));
console.log("movies-card.jpg full-bleed");

// Activities: pad so Ferris wheel sits inside frame, then cover
const act = path.join(dir, "activities-3d-flat.jpg");
const padded = await sharp(act)
  .extend({
    top: 120,
    bottom: 120,
    left: 40,
    right: 160,
    background: { r: 15, g: 46, b: 42 },
  })
  .toBuffer();

await sharp(padded)
  .resize(1600, 900, { fit: "cover", position: "right" })
  .jpeg({ quality: 92 })
  .toFile(path.join(dir, "activities-card.jpg"));
console.log("activities-card.jpg padded + full-bleed");

console.log("play-card.jpg unchanged");
