"""Rebuild the initial raster cutout and outlined letters from the approved reference."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
pixels = np.asarray(Image.open(ROOT / 'references/approved-logo.png').convert('RGB'), dtype=float)
height, width = pixels.shape[:2]

# Estimate the sky separately on each row from the empty left and right margins.
sky = np.median(np.concatenate([pixels[:, :140], pixels[:, 1110:]], axis=1), axis=1)
sky = gaussian_filter(sky, sigma=(12, 0))
color_difference = pixels[:, :, 0] - pixels[:, :, 2]
background_difference = (sky[:, 0] - sky[:, 2])[:, None]
alpha = np.clip((color_difference - background_difference - 5) / 35, 0, 1)
region = np.zeros_like(alpha)
region[335:855, 160:1080] = 1
alpha *= region
alpha = gaussian_filter(alpha, 0.6)
alpha[alpha < 0.035] = 0
foreground = (pixels - (1 - alpha[:, :, None]) * sky[:, None, :]) / np.maximum(alpha[:, :, None], 0.04)
foreground = np.clip(foreground, 0, 255)
rgba = np.dstack([foreground, alpha * 255]).astype('uint8')

# Split at a point below the cloud body, where only the hanging strand continues.
cloud = rgba[335:855, 160:1080].copy()
cloud[814-335:, 775-160:870-160, 3] = 0
Image.fromarray(cloud).save(ROOT / 'assets/cloud-texture.png')
Image.fromarray(rgba[814:855, 775:870]).save(ROOT / 'assets/white-yarn-connection.png')

def trace_letter(name, bounds):
    x0, y0, x1, y1 = bounds
    crop = pixels[y0:y1, x0:x1]
    mask = (crop[:, :, 2] < 115) & (crop[:, :, 0] < 110)
    field = gaussian_filter(mask.astype(float), 1.2)
    figure, axis = plt.subplots()
    contours = axis.contour(field, levels=[0.5])
    paths = []
    for vertices in contours.allsegs[0]:
        if len(vertices) < 8:
            continue
        points = vertices + [x0, y0]
        paths.append('M ' + ' L '.join(f'{x:.2f},{y:.2f}' for x, y in points) + ' Z')
    plt.close(figure)
    return f'<path id="letter-{name}" fill-rule="evenodd" d="{" ".join(paths)}"/>'

letters = [('u',(350,869,440,960)), ('n',(440,869,532,960)),
           ('r',(532,869,592,960)), ('a',(590,869,655,960)),
           ('v',(654,869,743,960)), ('e',(741,869,817,960))]
wordmark = '\n'.join(trace_letter(name, bounds) for name, bounds in letters)
(ROOT / 'source/wordmark-paths.svg').write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="340 830 570 140">\n'
    '<g id="letters-unrave" fill="#394540">\n' + wordmark + '\n</g>\n'
    '<path id="letter-l" fill="#394540" d="M 826,839 C 833,845 847,847 847,861 L 847,925 Q 847,937 860,928 L 860,946 Q 826,961 826,930 Z"/>\n'
    '<circle id="peach-period" cx="881" cy="938" r="13" fill="#E3AA87"/>\n</svg>\n')
print('Extracted cloud texture and outlined wordmark.')
