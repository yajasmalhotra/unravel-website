# Unravel editable asset kit

This kit turns the approved fluffy yarn cloud design into reusable components. Open the SVGs in Inkscape, Illustrator, or a browser. Agents can edit the SVG source and JSON directly. No image generation is needed to change colors, layout, size, or export format.

## Start here

- `references/approved-logo.png` is the exact approved image, preserved at its original 1254 × 1254 resolution.
- `exports/logo-sky.svg` is the reconstructed layered composition with a separate background, cloud, yarn connection, lettering, and peach period.
- `exports/logo-transparent.svg` is the tightly framed reusable logo, with no background.
- `source/brand.json` controls the palette used by the build script.
- `source/wordmark-paths.svg` contains individually editable outlined letters. No installed font is needed.
- `assets/cloud-texture.png` and `assets/white-yarn-connection.png` preserve the soft artwork as transparent raster components.
- `source/cloud-icon.svg` is a new, simplified vector interpretation for compact use. It is a draft extension of the approved identity.
- `source/yarn-divider.svg` provides an editable decorative thread.
- `assets/favicon-texture.png` is the approved transparent favicon, composited from the cloud and yarn textures.

## Asset inventory

| Export | Use |
| --- | --- |
| `logo-sky.svg` / `.png` | Square brand artwork and promotional placement |
| `logo-transparent.svg` / `.png` | Website, document and card layouts |
| `wordmark.svg` / `.png` | Narrow headers and email signatures |
| `wordmark-one-color.svg` / `.png` | Single-color wordmark applications |
| `cloud-icon.svg` / `.png` | Compact cloud and yarn motif |
| `favicon.svg` / `.png` | Transparent textured cloud and yarn for browser tabs |
| `yarn-divider.svg` / `.png` | Website section or page decoration |
| `sky-background.svg` / `.png` | Background without branding or text |
| `brand.css` | Reusable CSS color variables |

## Edit and rebuild

Edit `source/brand.json` for palette changes, the source SVGs for letter/icon/divider shapes, and `scripts/build.py` for the main composition's positioning. The generated SVGs embed their raster components, so each SVG can be moved independently.

From this folder run

```sh
python3 scripts/build.py
python3 scripts/export_png.py
```

To update the website favicon after rebuilding the SVG assets, run `python3 scripts/export_favicon.py`. This requires Pillow and writes the three existing `public/favicon.*` paths, including a 96-pixel PNG and a multi-size ICO. Other assets in this folder are retained for future design work and are not imported into the site's page layouts.

The build uses Python's standard library. PNG export requires the Inkscape command-line application. The initial extraction is already complete. To repeat it, `scripts/extract_reference.py` additionally requires NumPy, Pillow, SciPy and Matplotlib. Running extraction will replace the traced wordmark and texture components, so preserve any subsequent edits first.

You can also edit `exports/logo-sky.svg` directly in a vector editor using its named layers. Save such work under a new name or port those edits back to the canonical sources before running the builder again, because rebuilding replaces the exports.

## What is editable

The wordmark, period, icon, divider, dark yarn stem, and background geometry are vector elements. The cloud and the short pale yarn connection are raster textures. They can be moved, scaled, masked or replaced independently, but changing the internal fluffy cloud shape requires raster editing or a new illustration. A 1254-pixel reference has finite detail, even inside an SVG.

The original was a flattened generated image, so this is a reconstructed source kit. The background has been recreated with SVG gradient and grain, the cloud extracted with an approximate color matte, the letters traced, and the final yarn stem redrawn. These versions may differ subtly in edge detail and color from the approved reference. The original typeface was not supplied or identified. Outlined letters preserve their appearance but do not support typing arbitrary new words in the same font.

Review the cloud edge on the actual destination background, especially dark colors. The cutout is optimized for the existing pale blue palette. SVG filter appearance can vary between applications. Use the PNG exports when matching the rendered appearance is more important than editing.

## Future design work

This directory lives at `assets/unravel/` in the website's Git repository. Commit source edits alongside regenerated exports, and retain the approved reference as the visual benchmark. Other agents should read `AGENTS.md` before editing. The included asset-preview.png records the original kit comparison and shows the earlier compact-icon proposal. Use exports/favicon.svg for the current website tab icon.

These are RGB design assets. Business cards and brochures still need their own layout, contact details, dimensions, bleed, and the printer's export requirements. The kit contains no finished print layout.
