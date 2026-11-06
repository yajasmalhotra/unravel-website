"""Render the cloud-and-thread favicon into the website's existing public paths."""
from pathlib import Path
import hashlib
import json
import shutil
import subprocess
from tempfile import TemporaryDirectory
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT.parents[1] / 'public'
inkscape = shutil.which('inkscape')
if not inkscape:
    raise SystemExit('Install Inkscape and put its executable on PATH.')

source = ROOT / 'exports/favicon.svg'
with TemporaryDirectory() as directory:
    rendered = Path(directory) / 'favicon.png'
    subprocess.run([inkscape, str(source), f'--export-filename={rendered}',
                    '--export-width=512'], check=True, capture_output=True)
    with Image.open(rendered) as image:
        image.resize((96, 96), Image.Resampling.LANCZOS).save(PUBLIC / 'favicon.png')
        image.save(PUBLIC / 'favicon.ico', sizes=[(16,16), (32,32), (48,48), (64,64), (128,128), (256,256)])
shutil.copyfile(source, PUBLIC / 'favicon.svg')
manifest = PUBLIC.parent / 'content/artwork-assets.json'
records = json.loads(manifest.read_text())
record = next(asset for asset in records if asset['path'] == '/favicon.png')
png = (PUBLIC / 'favicon.png').read_bytes()
record.update(width=96, height=96, bytes=len(png), sha256=hashlib.sha256(png).hexdigest())
manifest.write_text(json.dumps(records, indent=2) + '\n')
print('Updated public/favicon.svg, favicon.png and favicon.ico.')
