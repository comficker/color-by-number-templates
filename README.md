# color-by-number-templates

113 colour-by-number templates as plain JSON and CSV — the grid, the colour key, the size, the tags —
plus a small library and a CLI that renders any of them as an SVG you can print.

Every template here is a sheet on [SquareColoring](https://www.squarecoloring.com/printable), a free
[color by number printables](https://www.squarecoloring.com/printable) site. The numbers in this pack are
the same numbers its PDFs print, so a file and the printed sheet never disagree.

Read in another language: [Deutsch](i18n/README.de.md) · [Français](i18n/README.fr.md) ·
[Español](i18n/README.es.md) · [Português](i18n/README.pt.md) · [中文](i18n/README.zh.md)

## Install

```sh
npm install color-by-number-templates
```

Or take the data on its own — it is just files:

```
https://cdn.jsdelivr.net/npm/color-by-number-templates/data/index.json
https://cdn.jsdelivr.net/npm/color-by-number-templates/data/json/chubby-bumblebee.json
```

## Use it

```js
import { findTemplates, getTemplate, toSVG, toColors } from 'color-by-number-templates'

// Everything a six-year-old can finish: 16 squares a side, eight colours.
const easy = findTemplates({ collection: 'for-kids' })

const t = getTemplate('chubby-bumblebee')
t.width        // 14
t.key[3]       // { number: 3, hex: '#C9E8EC', used: true }
t.grid[6][4]   // 5  — the number printed in that square; null means leave it blank

toSVG(t)                      // the numbered grid, with its key, ready to print
toSVG(t, { solution: true })  // the finished picture
toColors(t)                   // rows of hex colours, for rendering it yourself
```

From the shell:

```sh
npx color-by-number collections
npx color-by-number list --collection animals --max-colors 8
npx color-by-number chubby-bumblebee --format svg --out bumblebee.svg
npx color-by-number chubby-bumblebee --format csv
```

## What is in a template

```jsonc
{
  "id": "chubby-bumblebee",
  "name": "Chubby Bumblebee",
  "width": 14, "height": 14,
  "squares": 126,          // squares that carry a number; the rest are blank
  "colors": 9,
  "tags": ["animal", "bug", "insect", "bee", "yellow"],
  "collections": ["printables", "animals", "pixel-art"],
  "key": [{ "number": 0, "hex": "#904F24", "used": true }, /* … */],
  "grid": [[null, null, null, /* … */]],  // rows, top-left first
  "squarecoloring": "https://www.squarecoloring.com/page/chubby-bumblebee",
  "urls": { "en": "…/page/chubby-bumblebee", "de": "…/de/vorlage/…", "fr": "…/fr/fiche/…" },
  "license": "CC-BY-4.0",
  "credit": "“Chubby Bumblebee” colour-by-number template by SquareColoring — …"
}
```

**Numbering starts at 0.** That is what the printed sheet prints, and matching the sheet matters more
than matching the convention. `key[n]` is always the colour for the number `n` in the grid.

The same grid is in `data/csv/<id>.csv`, one row per line, empty field for a blank square — paste it
straight into a spreadsheet or a cross-stitch tool.

## Collections

The five shelves the templates are sorted into, and the page each one has:

| Collection | Templates | What is in it |
|---|---|---|
| [Color by number printables](https://www.squarecoloring.com/printable) | 113 | everything |
| [Color by number for kids](https://www.squarecoloring.com/printable/for-kids) | 45 | 16 squares a side or less, up to 8 colours |
| [Color by number for adults](https://www.squarecoloring.com/printable/for-adults) | 42 | 18 squares a side or more, or 12+ colours |
| [Animal color by number](https://www.squarecoloring.com/printable/animals) | 30 | cats, birds, fish, bugs |
| [Pixel art color by number](https://www.squarecoloring.com/printable/pixel-art) | 84 | sprite-sized: 16×16 or under |

## Some of the templates

The full index is in [CATALOG.md](CATALOG.md) and in `data/index.json`.

<!-- templates:start -->
| Template | Grid | Colours | Squares | Collection | File |
|---|---|---|---|---|---|
| [Angry Red Face](https://www.squarecoloring.com/page/angry-red-face) | 13×14 | 6 | 148 | [Color by number for kids](https://www.squarecoloring.com/printable/for-kids) | `data/json/angry-red-face.json` |
| [Blushing Wink Face](https://www.squarecoloring.com/page/blushing-wink-face) | 13×13 | 6 | 137 | [Color by number for kids](https://www.squarecoloring.com/printable/for-kids) | `data/json/blushing-wink-face.json` |
| [Bunch of Grapes](https://www.squarecoloring.com/page/bunch-of-grapes) | 11×11 | 5 | 63 | [Color by number for kids](https://www.squarecoloring.com/printable/for-kids) | `data/json/bunch-of-grapes.json` |
| [Chubby Dodo Bird](https://www.squarecoloring.com/page/chubby-dodo-bird) | 16×16 | 7 | 141 | [Color by number for kids](https://www.squarecoloring.com/printable/for-kids) | `data/json/chubby-dodo-bird.json` |
| [Adventurer in Fedora](https://www.squarecoloring.com/page/adventurer-in-fedora) | 20×20 | 11 | 193 | [Color by number for adults](https://www.squarecoloring.com/printable/for-adults) | `data/json/adventurer-in-fedora.json` |
| [Bald Man with Beard](https://www.squarecoloring.com/page/bald-man-with-beard) | 22×22 | 8 | 270 | [Color by number for adults](https://www.squarecoloring.com/printable/for-adults) | `data/json/bald-man-with-beard.json` |
| [Blue milk cartons](https://www.squarecoloring.com/page/blue-milk-cartons) | 18×18 | 11 | 192 | [Color by number for adults](https://www.squarecoloring.com/printable/for-adults) | `data/json/blue-milk-cartons.json` |
| [Blue Whale Spouting](https://www.squarecoloring.com/page/blue-whale-spouting) | 20×20 | 7 | 158 | [Color by number for adults](https://www.squarecoloring.com/printable/for-adults) | `data/json/blue-whale-spouting.json` |
| [Blue Crescent Bird](https://www.squarecoloring.com/page/blue-crescent-bird) | 15×15 | 10 | 90 | [Animal color by number](https://www.squarecoloring.com/printable/animals) | `data/json/blue-crescent-bird.json` |
| [Brown Bear Pixel Art](https://www.squarecoloring.com/page/brown-bear-pixel-art) | 21×21 | 8 | 224 | [Color by number for adults](https://www.squarecoloring.com/printable/for-adults) | `data/json/brown-bear-pixel-art.json` |
| [Cat Under a Sprout](https://www.squarecoloring.com/page/cat-under-a-sprout) | 24×24 | 8 | 225 | [Color by number for adults](https://www.squarecoloring.com/printable/for-adults) | `data/json/cat-under-a-sprout.json` |
| [Blue Cupcake](https://www.squarecoloring.com/page/blue-cupcake) | 12×12 | 9 | 108 | [Pixel art color by number](https://www.squarecoloring.com/printable/pixel-art) | `data/json/blue-cupcake.json` |
<!-- templates:end -->

## Licence

The code in `src/` and `tools/` is MIT — see [LICENSE](LICENSE).

The templates in `data/` are **CC BY 4.0** — see [LICENSE-DATA](LICENSE-DATA) and [SOURCES.md](SOURCES.md).
Use them in an app, a worksheet, a game, a cross-stitch chart, whatever; just keep the credit:

> Colour-by-number templates by SquareColoring (https://www.squarecoloring.com)

Each template carries its own `credit` string if you would rather name the single sheet you used.

## Something wrong?

A number that does not match the printed sheet, a colour key that looks off, a missing template — open
an issue. There is a [template for it](https://github.com/comficker/color-by-number-templates/issues/new/choose);
say which `id` and what you expected.

## About SquareColoring

[SquareColoring](https://www.squarecoloring.com) turns small pixel grids into colour-by-number sheets you
can print: A4, US Letter, A5 or square, black and white, no watermark, no account, as many copies as you
like. Four kinds of sheet from the same grid — numbered, plain outline, the finished picture, and a
[cross-stitch chart](https://www.squarecoloring.com/guide/cross-stitch). There is also an
[online colouring page](https://www.squarecoloring.com/online) if you would rather not print anything.

This pack is the data behind those sheets, published so other people can build with it.
