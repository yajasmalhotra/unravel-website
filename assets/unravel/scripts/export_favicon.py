"""Render the cloud-and-thread favicon into the website's existing public paths."""
from pathlib import Path
import hashlib
import json
import shutil
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT.parents[1] / 'public'
with Image.open(ROOT / 'assets/favicon-texture.png') as image:
    image.resize((96, 96), Image.Resampling.LANCZOS).save(PUBLIC / 'favicon.png')
    image.save(PUBLIC / 'favicon.ico', sizes=[(16,16), (32,32), (48,48), (64,64), (128,128), (256,256)])
shutil.copyfile(ROOT / 'exports/favicon.svg', PUBLIC / 'favicon.svg')
manifest = PUBLIC.parent / 'content/artwork-assets.json'
records = json.loads(manifest.read_text())
record = next(asset for asset in records if asset['path'] == '/favicon.png')
png = (PUBLIC / 'favicon.png').read_bytes()
record.update(width=96, height=96, bytes=len(png), sha256=hashlib.sha256(png).hexdigest())
manifest.write_text(json.dumps(records, indent=2) + '\n')
print('Updated public/favicon.svg, favicon.png and favicon.ico.')
