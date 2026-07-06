import os
import subprocess
import tempfile
from pathlib import Path

def render_to_png(md_path):
  here = Path(__file__)
  repo_root = here.parent.parent
  render_drawing_path = repo_root / "render" / "render-drawing.js"
  fd, path = tempfile.mkstemp(suffix=".png")
  os.close(fd)
  try:
    subprocess.run(["node", str(render_drawing_path), md_path, path], check=True)
  except:
    os.remove(path)
    raise
  return path
