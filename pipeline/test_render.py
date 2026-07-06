from pipeline.render import render_to_png
from pathlib import Path
import pytest

FIXTURE = "Kth Largest Element in a Stream Drawing.md"

def test_returns_path_to_a_real_png():
    out = render_to_png(FIXTURE)
    assert Path(out).exists()

def test_bad_path_raises():
    with pytest.raises(Exception):
        render_to_png("does-not-exist.md")