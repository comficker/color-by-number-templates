# Where this data comes from

## The templates

Every template in `data/` is a sheet published on [SquareColoring](https://www.squarecoloring.com/printable),
drawn on the site's own team accounts. They are released here under
[CC BY 4.0](LICENSE-DATA) by the people who made them.

SquareColoring also hosts pieces made by its members. **Those are not in this pack.** Members grant the
site a licence to host and display their work, which is not a licence to republish it on npm, so the
build script (`tools/build-data.mjs`) keeps an explicit list of the accounts whose work may be included
and skips everything else. If you are looking for a sheet that is on the website but not in `data/`,
that is why — print it from its page instead.

## How each field is produced

The pack is generated, not hand-written. `node tools/build-data.mjs` reads the catalogue the website is
built from and fetches the grid for each sheet from the SquareColoring API.

| Field | Where it comes from |
|---|---|
| `id`, `name`, `tags` | the sheet's own record on SquareColoring |
| `width`, `height` | the grid as drawn |
| `grid` | the sheet's square-by-square numbers, row-major; `null` is a square with no colour |
| `key` | the sheet's palette, in the order the printed legend numbers it |
| `squares` | counted from the grid: squares that carry a number |
| `collections` | the same filters the website's shelves use (size, colour count, animal tags) |
| `urls` | the sheet's page in each language the site publishes it in |

No record links straight to a PDF. The sheets are rendered on request by a small
box behind the website, and a dataset that is mirrored across npm, jsDelivr and
unpkg should not send traffic at it. Open the sheet's page and print from there;
everything needed to render your own copy — the grid and the key — is in the data.

The build refuses to write a template whose grid disagrees with the catalogue — a wrong size, a palette
that has changed, a square count that does not add up, or a number with no colour behind it. The tests in
`test/` check the same things again on what was written.

## Numbering

Numbers start at **0** and index `key` directly. This is not the usual convention for a colour-by-number
sheet, but it is what SquareColoring's PDFs print, and a pack whose numbers did not match the printed
sheet would be worse than no pack at all.

## Colours

Hex values are the artist's own choices, not a standard palette. They are not matched to pencil, thread or
bead brands — if you need DMC thread codes, the site's
[cross-stitch sheets](https://www.squarecoloring.com/guide/cross-stitch) carry them, but this pack does not.

## Refreshing

```sh
node tools/build-data.mjs   # refetch every template
node tools/build-readme.mjs # regenerate the tables in README.md and CATALOG.md
npm test
```
