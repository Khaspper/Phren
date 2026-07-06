# Phren — Domain Glossary

Shared vocabulary for the project. Define a term here the first time it earns a precise meaning.

## Embedding

Turning a piece of content into a list of numbers (a vector) that captures its
meaning, so similar content sits close together. We can then search by meaning
instead of exact words. Our embedder is the `nomic-embed-text` model, run via
Ollama. It is **text-only** — it cannot read images.

## Vision model

An AI model that looks at an image and outputs text describing it (and can
transcribe text/handwriting inside the image). Separate from the embedder.
Ours is `gemma4:12b` (the multimodal variant), run via Ollama.

## Obsidian vault

The folder of notes Markus writes on his Mac and pushes to GitHub. Contains
markdown files, images, and Excalidraw drawings. On the Ubuntu server ("prod"),
the vault is kept up to date by pulling from GitHub.

## Excalidraw drawing (`.excalidraw.md`)

A drawing made with the Obsidian Excalidraw plugin, saved as a markdown file
(`excalidraw-plugin: parsed` in the frontmatter). It has two sections that
matter:

- `## Text Elements` — readable typed-text labels, extracted by the plugin.
  In Markus's drawings this is usually **empty** (his content is shapes +
  *handwritten* strokes, not typed text).
- `## Drawing` — the picture itself, stored as `compressed-json`.

## compressed-json

The drawing data under `## Drawing`. It is the **scene** (see below) compressed
with the **LZ-String** library and base64-encoded — this is the "gibberish."
To read it: strip the newlines, then run `LZString.decompressFromBase64(...)`.

## Scene / element JSON

What you get after decompressing: a list of *elements* — `rectangle`, `ellipse`,
`line`, `arrow`, and `freedraw`. It is geometry (shapes and coordinates), **not**
an image.

## freedraw

A pen-stroke element: a list of points making up one drawn line. Markus's
handwriting is stored as freedraw strokes, not as text. Because these are vector
paths, they render correctly regardless of which fonts are installed.

## Renderer (the JS script)

A separate Node.js script that turns an Excalidraw drawing into a PNG. It owns
**both** decompression and rendering (see [[seam]]), using the real Excalidraw
renderer inside headless Chromium for visual fidelity. Python calls it as a
subprocess and reads the PNG it writes.

## seam

The boundary between the Python pipeline and the JS renderer. We chose **Seam A**:
the JS script takes a `.excalidraw.md` path and returns a PNG. Python knows
nothing about Excalidraw — it just asks for a picture. See `docs/adr/0001`.

## render_to_png (Python)

`render_to_png(md_path) -> png_path`, in `pipeline/render.py`. A thin Python
wrapper around the JS renderer — the [[seam]] in code. Picks a **temp file** for
output (thrown away after use — we keep the description, not a pile of PNGs),
locates the JS script relative to its own file (not the current directory), runs
`node render/render-drawing.js <md> <tmp>` via `subprocess`, and returns the PNG
path on exit 0. On non-zero exit it **raises** — fail loud, so a broken drawing
never silently embeds as empty text.

## describe (Python)

`describe(png_path) -> description`, in `pipeline/describe.py`. The vision step.
Sends the PNG to the [[vision model]] (`gemma4:12b`) via the `ollama` library
(`ollama.chat`, image attached), pointed at the home Ubuntu server over Tailscale
— host comes from `OLLAMA_HOST` in `.env`, which the `ollama` lib reads
automatically. Returns **just the description text**.

Key framing: **no separate handwriting transcription.** The canvas is spatial
with no reading order, so verbatim transcription is meaningless. Instead the
prompt asks the model to describe the drawing *and fold in any legible words* it
can read (that text is the searchable content), without guessing at illegible
strokes. Ollama errors propagate — fail loud.
