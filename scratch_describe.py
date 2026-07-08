from dotenv import load_dotenv
load_dotenv()                      # loads OLLAMA_HOST from .env
from pipeline.render import render_to_png
from pipeline.describe import describe

png = render_to_png("Kth Largest Element in a Stream Drawing.md")
print('Calling describe')
print(describe(png))
print('Done calling describe')