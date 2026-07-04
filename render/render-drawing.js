import puppeteer from "puppeteer";
import parseScene from "./parse-scene.js";
import fs from "node:fs";

const browser = await puppeteer.launch();
try {
  const args = process.argv.slice(2);
  const drawingPath = args[0];
  const outDrawingPath = args[1];

  if (!drawingPath) {
    throw new Error("Drawing path not given.");
  }
  if (!outDrawingPath) {
    throw new Error("Output drawing path not given.");
  }

  const scene = parseScene(fs.readFileSync(drawingPath, "utf8"));

  const page = await browser.newPage();
  const filePath =
    "file:///Users/khaspper/Documents/Projects/Phren/render/page/index.html";
  await page.goto(filePath);
  const base64Data = await page.evaluate(async (scene) => {
    const blob = await window.exportToBlob({
      elements: scene.elements,
      files: scene.files ?? {},
    });

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Resolve the promise when the read is successfully completed
      reader.onloadend = () => resolve(reader.result);

      // Reject the promise if there's an error
      reader.onerror = reject;

      // Read the blob as a Data URL (which is a base64 string)
      reader.readAsDataURL(blob);
    });

    // Strip the "data:image/png;base64," prefix — Buffer wants only the base64 part
    return dataUrl.split(",")[1];
  }, scene);

  fs.writeFileSync(outDrawingPath, Buffer.from(base64Data, "base64"));
} catch (error) {
  console.error(`Failed LOL: ${error}`);
  process.exit(1);
} finally {
  console.log("Closing the Browser now");
  browser.close();
}
