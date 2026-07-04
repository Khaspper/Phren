import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import parseScene from "./parse-scene.js";

const text = fs.readFileSync(
  "./Kth Largest Element in a Stream Drawing.md",
  "utf8",
);

test("Confirm 'parseScene' hands back a scene whose elements is a non empty array.", () => {
  const scene = parseScene(text);
  assert.ok(scene.elements.length > 0);
});

test("At least one element type is freedraw", () => {
  const scene = parseScene(text);
  const hasFreeDraw = scene.elements.some((e) => {
    return e.type === "freedraw";
  });
  assert.ok(hasFreeDraw);
});
