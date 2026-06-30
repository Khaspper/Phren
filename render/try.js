import fs from "node:fs";
import parseScene from "./parse-scene.js";

const text = fs.readFileSync(
  "./Kth Largest Element in a Stream Drawing.md",
  "utf8",
);
const scene = parseScene(text);
// console.log(scene.elements.length);
