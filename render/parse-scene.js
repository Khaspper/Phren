import LZString from "lz-string";

export default function parseScene(fileText) {
  const blob = fileText
    .split("```compressed-json")[1]
    .split("```")[0]
    .split("\n")
    .join("");
  const json = LZString.decompressFromBase64(blob);
  const scene = JSON.parse(json);
  return scene;
}
