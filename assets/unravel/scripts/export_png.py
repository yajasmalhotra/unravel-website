"""Render delivery PNGs with the Inkscape command-line application."""
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
inkscape = shutil.which('inkscape')
if not inkscape:
    raise SystemExit('Install Inkscape and put its executable on PATH.')
sizes = {'logo-sky':1254, 'logo-transparent':1200, 'wordmark':1200,
         'wordmark-one-color':1200, 'cloud-icon':512, 'favicon':256,
         'yarn-divider':1600, 'sky-background':1600}
for name, width in sizes.items():
    subprocess.run([inkscape, str(ROOT / f'exports/{name}.svg'),
                    f'--export-filename={ROOT / f"exports/{name}.png"}',
                    f'--export-width={width}'], check=True, capture_output=True)
print('Rendered eight PNG exports.')
