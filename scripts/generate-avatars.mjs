// Generates local illustrated avatars (no network needed) into public/avatars/.
import fs from "node:fs";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

const src = fs.readFileSync("src/db/profiles-data.ts", "utf8");
const keys = [...new Set([...src.matchAll(/gender: "(women|men)", portrait: (\d+)/g)].map((m) => `${m[1]}-${m[2]}`))];

const backgrounds = ["f6d5d2", "fbe9e7", "f3ece3", "e8d9c8", "dfe8e0", "f2dcc9"];
const skins = ["f1c9a5", "e0ac84", "c68e63", "a8734d", "8d5a3b"];
const hairs = ["1f1511", "2b1b12", "3a2418", "55341f"];
const happyMouths = Array.from({ length: 18 }, (_, i) => `happy${String(i + 1).padStart(2, "0")}`);
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

keys.forEach((key, i) => {
  const h = hash(key);
  const svg = createAvatar(lorelei, {
    seed: key,
    size: 640,
    backgroundColor: [backgrounds[i % backgrounds.length]],
    skinColor: [skins[h % skins.length]],
    hairColor: [hairs[(h >> 3) % hairs.length]],
    mouth: [happyMouths[(h >> 5) % happyMouths.length]],
    // Friendly look: no glasses/beards/freckles by default, but vary a little by hash.
    glassesProbability: h % 5 === 0 ? 100 : 0,
    beardProbability: key.startsWith("men") && h % 4 === 0 ? 100 : 0,
    frecklesProbability: 0,
    earringsProbability: key.startsWith("women") && h % 2 === 0 ? 100 : 0,
  }).toString();
  fs.writeFileSync(`public/avatars/${key}.svg`, svg);
});
console.log(`Wrote ${keys.length} avatars`);
