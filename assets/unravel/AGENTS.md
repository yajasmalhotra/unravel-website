# Working on the Unravel brand

Read README.md and inspect references/approved-logo.png before editing.

The approved visual direction is a fluffy ivory yarn cloud, a loose strand that forms the final lowercase l, a dark charcoal-green wordmark, a peach period, and a grainy muted blue sky. Preserve these relationships unless the user requests a change.

Use the files already supplied. Make deterministic SVG, JSON, CSS, Python or raster edits for ordinary layout and asset changes. Use image generation only if the user asks for newly generated artwork.

Canonical inputs are source/, assets/, and scripts/build.py. exports/ contains reproducible outputs. Rebuild with python3 scripts/build.py and then python3 scripts/export_png.py after changes. The original extraction script is a one-time reconstruction tool and should not be rerun during routine edits.

Keep meaningful element IDs and layer names. Maintain separate cloud, yarn, wordmark, dot and background layers. Each outlined letter has an ID in source/wordmark-paths.svg. The pale yarn connection is a raster element and the lower stem is a vector path.

Inspect changed SVGs in a real renderer. Check transparent exports on the intended background and check icon legibility at its intended size. Confirm that the word reads unravel, that the strand visibly connects to the l, and that assets have no clipped edges.

The compact cloud icon is a proposed vector extension. Do not describe it as separately approved. Do not describe the main cloud as fully vector or infinitely detailed. Preserve the original reference and record meaningful changes in normal repository commits when this kit is placed in a Git repository.

The website favicon has its own source/favicon.svg. The user requested only a cloud with a trailing thread, with no gray l, lettering, or peach dot. After rebuilding the kit, run scripts/export_favicon.py to refresh the three public favicon formats. All other kit assets are archived here for future use, without integration into page layouts.
