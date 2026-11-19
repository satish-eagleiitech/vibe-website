import fs from "node:fs";

const path = new URL("../lib/data/eventCategories.ts", import.meta.url);
let source = fs.readFileSync(path, "utf8");
const next = source.replace(
  /href: "\/events\/category\/([a-z-]+)"/g,
  'href: "/events?category=$1#all-events"',
);
fs.writeFileSync(path, next);
console.log("updated", (next.match(/#all-events/g) || []).length);
