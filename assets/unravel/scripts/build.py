"""Build portable SVG assets from the editable sources, using only Python's standard library."""
from pathlib import Path
import base64
import copy
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SVG = 'http://www.w3.org/2000/svg'
INKSCAPE = 'http://www.inkscape.org/namespaces/inkscape'
ET.register_namespace('', SVG)
ET.register_namespace('inkscape', INKSCAPE)
colors = json.loads((ROOT / 'source/brand.json').read_text())['colors']
output = ROOT / 'exports'
output.mkdir(exist_ok=True)

def element(tag, attributes=None, children=()):
    result = ET.Element(f'{{{SVG}}}{tag}', attributes or {})
    result.extend(children)
    return result

def layer(name, children):
    return element('g', {'id': name, f'{{{INKSCAPE}}}groupmode': 'layer',
                         f'{{{INKSCAPE}}}label': name}, children)

def recolor(node):
    replacements = {'#394540': colors['ink'], '#E3AA87': colors['peach'], '#F4EDE4': colors['cream'], '#6993BE': colors['sky_top']}
    for child in node.iter():
        for key in ['fill', 'stroke']:
            if child.get(key) in replacements:
                child.set(key, replacements[child.get(key)])
    return node

def root(viewbox, label):
    node = element('svg', {'viewBox': viewbox, 'role': 'img', 'aria-label': label})
    title = element('title')
    title.text = label
    node.append(title)
    return node

def write(name, node):
    ET.indent(node)
    (output / name).write_bytes(ET.tostring(node, encoding='utf-8', xml_declaration=True))

def raster(filename, x, y, width, height):
    payload = base64.b64encode((ROOT / 'assets' / filename).read_bytes()).decode()
    return element('image', {'x':str(x), 'y':str(y), 'width':str(width), 'height':str(height),
                             'href': 'data:image/png;base64,' + payload})

def background():
    gradient = element('linearGradient', {'id':'sky-gradient', 'x2':'0', 'y2':'1'})
    gradient.extend([element('stop', {'offset':'0', 'stop-color':colors['sky_top']}),
                     element('stop', {'offset':'1', 'stop-color':colors['sky_bottom']})])
    grain = element('filter', {'id':'sky-grain', 'x':'0', 'y':'0', 'width':'100%', 'height':'100%'})
    grain.append(element('feTurbulence', {'type':'fractalNoise', 'baseFrequency':'.8', 'numOctaves':'3', 'seed':'12', 'stitchTiles':'stitch'}))
    grain.append(element('feColorMatrix', {'type':'saturate', 'values':'0'}))
    return [element('defs', children=[gradient, grain]), layer('sky-background', [
        element('rect', {'width':'1254', 'height':'1254', 'fill':'url(#sky-gradient)'}),
        element('rect', {'width':'1254', 'height':'1254', 'filter':'url(#sky-grain)', 'opacity':'.055'})])]

def logo_layers():
    wordmark = recolor(ET.parse(ROOT / 'source/wordmark-paths.svg').getroot())
    yarn_gradient = element('linearGradient', {'id':'yarn-transition', 'gradientUnits':'userSpaceOnUse', 'x1':'0', 'y1':'834', 'x2':'0', 'y2':'866'})
    yarn_gradient.extend([element('stop', {'offset':'0', 'stop-color':'#ACB1A0'}),
                          element('stop', {'offset':'1', 'stop-color':colors['ink']})])
    letter_l = copy.deepcopy(wordmark.find(f"{{{SVG}}}path"))
    letter_l.set('fill', 'url(#yarn-transition)')
    return [element('defs', children=[yarn_gradient]),
        layer('cloud-texture', [raster('cloud-texture.png',160,335,920,520)]),
        layer('yarn-tail-and-l', [raster('white-yarn-connection.png',775,814,95,41), letter_l]),
        layer('wordmark-unrave', [copy.deepcopy(wordmark.find(f'{{{SVG}}}g'))]),
        layer('peach-period', [copy.deepcopy(wordmark.find(f'{{{SVG}}}circle'))])]

primary = root('0 0 1254 1254', 'Unravel cloud logo on a blue sky')
primary.extend(background() + logo_layers())
write('logo-sky.svg', primary)
transparent = root('150 330 950 650', 'Unravel cloud logo on a transparent background')
transparent.extend(logo_layers())
write('logo-transparent.svg', transparent)
wordmark = recolor(ET.parse(ROOT / 'source/wordmark-paths.svg').getroot())
write('wordmark.svg', wordmark)
for child in wordmark.iter():
    if child.get('fill'):
        child.set('fill', colors['ink'])
write('wordmark-one-color.svg', wordmark)
for name in ['cloud-icon', 'yarn-divider']:
    write(name + '.svg', recolor(ET.parse(ROOT / f'source/{name}.svg').getroot()))
icon = root('0 0 256 256', 'Unravel textured cloud with trailing yarn')
icon.append(raster('favicon-texture.png', 0, 0, 256, 256))
write('favicon.svg', icon)
sky = root('0 0 1254 1254', 'Unravel sky background')
sky.extend(background())
write('sky-background.svg', sky)
css = ':root {\n' + '\n'.join(f'  --unravel-{name.replace("_", "-")}: {value};' for name,value in colors.items()) + '\n}\n'
(output / 'brand.css').write_text(css)
print('Built eight SVG assets and brand.css.')
