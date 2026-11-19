import fs from "node:fs";

const path = new URL("../lib/data/fallback.ts", import.meta.url);
let source = fs.readFileSync(path, "utf8");
const next = source.replace(
  /export const fallbackEvents: LiveEvent\[] = \[[\s\S]*?\];\r?\n/,
  'export { eventsCatalog as fallbackEvents } from "@/lib/data/eventsCatalog";\n',
);
if (next === source) {
  console.error("pattern not found");
  process.exit(1);
}
fs.writeFileSync(path, next);
console.log("patched");
