# use journalctl -u ollama -f to see logs

import ollama

PROMPT = (
    "This is a hand-drawn diagram from a personal notebook on an infinite "
    "canvas — there is no fixed reading order. Describe what it shows: the "
    "shapes, how they connect, and what the drawing is about. Read any "
    "handwritten or typed words you can make out and include them in your "
    "description as part of the content. Do not guess at illegible text. "
    "Write a single clear paragraph aimed at someone searching their notes later."
  )
def describe(image):
  response = ollama.chat(
    model="gemma4:12b",
    messages=[{"role": "user", "content": PROMPT, "images": [image]}],
    think=False
  )
  return response.message.content