/**
 * Rebuild `data/` from the SquareColoring API.
 *
 * The catalogue the website is generated from already says which sheets are
 * published (`squarecoloring_web/app/data/catalog.json`): same size envelope,
 * same exclusions, same titles. This script takes that list and fetches the
 * one thing the catalogue leaves out — the grid itself — then writes one JSON
 * and one CSV per template plus an index.
 *
 *   node tools/build-data.mjs            # all templates
 *   node tools/build-data.mjs --limit 5  # a quick dry run
 *
 * Numbers are written exactly as the printed sheet prints them: an index into
 * the palette, starting at 0 (see `print_render.py`, `legend__num`). A file
 * whose numbers disagreed with the PDF would be worse than no file.
 */
import { mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const WEB = join(ROOT, '..', 'squarecoloring_web', 'app', 'data')
const API = process.env.API || 'https://touch.ninosaur.com'
const SITE = 'https://www.squarecoloring.com'

const limit = (() => {
  const i = process.argv.indexOf('--limit')
  return i === -1 ? Infinity : Number(process.argv[i + 1])
})()

const catalog = JSON.parse(readFileSync(join(WEB, 'catalog.json'), 'utf8'))
const names = JSON.parse(readFileSync(join(WEB, 'names-intl.json'), 'utf8'))

/* ---- collections: the same filters the website's hubs use ---------------- */

const ANIMAL = new Set([
  'animal', 'bird', 'cat', 'dog', 'fish', 'butterfly', 'pet', 'insect', 'frog',
  'bear', 'fox', 'owl', 'duck', 'horse', 'hen', 'chicken', 'penguin', 'rabbit',
  'bunny', 'snake', 'bee', 'whale', 'shark'
])

const HUBS = [
  { path: '/printable', id: 'printables', title: 'Color by number printables', match: () => true },
  { path: '/printable/for-kids', id: 'for-kids', title: 'Color by number for kids', match: (s) => s.w <= 16 && s.h <= 16 && s.colors <= 8 },
  { path: '/printable/for-adults', id: 'for-adults', title: 'Color by number for adults', match: (s) => Math.max(s.w, s.h) >= 18 || s.colors >= 12 },
  { path: '/printable/animals', id: 'animals', title: 'Animal color by number', match: (s) => s.tags.some((t) => ANIMAL.has(t)) },
  { path: '/printable/pixel-art', id: 'pixel-art', title: 'Pixel art color by number', match: (s) => s.w <= 16 && s.h <= 16 }
]

/* ---- translated URLs: ported from the site's sheets-intl.ts -------------- */

const DIACRITIC = {
  'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
  'à': 'a', 'â': 'a', 'ç': 'c', 'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
  'î': 'i', 'ï': 'i', 'ô': 'o', 'û': 'u', 'ù': 'u', 'ÿ': 'y', 'œ': 'oe', 'æ': 'ae'
}
const SECTION = { de: 'vorlage', fr: 'fiche' }

const slugify = (s) =>
  s.toLowerCase()
    .replace(/[äöüßàâçéèêëîïôûùÿœæ]/g, (c) => DIACRITIC[c] || c)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** The site keeps both sheets when two titles collide, suffixing the second
 *  with its size — so the slug depends on catalogue order, not on the sheet. */
const localised = (lang) => {
  const seen = new Map()
  const out = new Map()
  for (const sheet of catalog) {
    const name = names[sheet.name]?.[lang]
    if (!name) continue
    let slug = slugify(name)
    const n = (seen.get(slug) || 0) + 1
    seen.set(slug, n)
    if (n > 1) slug = `${slug}-${sheet.w}x${sheet.h}`
    out.set(sheet.slug, { name, url: `${SITE}/${lang}/${SECTION[lang]}/${slug}` })
  }
  return out
}
const DE = localised('de')
const FR = localised('fr')

/* ---- fetch --------------------------------------------------------------- */

/**
 * Whose work may be republished here.
 *
 * The site's terms only ever asked a member for "a non-exclusive licence to
 * host and display" what they make, and say templates are not licensed for
 * redistribution. That is nowhere near enough to put someone else's artwork
 * on npm under CC BY, so the pack carries only the sheets drawn on the
 * SquareColoring team's own accounts. Everything else stays on the website,
 * where its author agreed it could be.
 *
 * Matched on account id rather than name: a name can be changed or reused,
 * and these particular names are not ours to publish.
 */
const OWN_ACCOUNT_IDS = new Set([1, 26537])

const get = async (url) => {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { Accept: 'application/json' } })
      if (r.ok) return await r.json()
    } catch { /* retry */ }
    await new Promise((r) => setTimeout(r, 1500))
  }
  throw new Error(`failed: ${url}`)
}

/* ---- write --------------------------------------------------------------- */

const jsonDir = join(ROOT, 'data', 'json')
const csvDir = join(ROOT, 'data', 'csv')
mkdirSync(jsonDir, { recursive: true })
mkdirSync(csvDir, { recursive: true })

const toGrid = (mapNumbers, w, h) => {
  const grid = Array.from({ length: h }, () => Array(w).fill(null))
  for (const [key, num] of Object.entries(mapNumbers || {})) {
    const [x, y] = key.split('_').map(Number)
    if (!Number.isInteger(x) || !Number.isInteger(y)) continue
    if (x < 0 || y < 0 || x >= w || y >= h) continue
    if (num === null || num < 0) continue
    grid[y][x] = num
  }
  return grid
}

const csvOf = (grid) => grid.map((row) => row.map((n) => (n === null ? '' : n)).join(',')).join('\n') + '\n'

const index = []
const problems = []
const notOurs = []
const wanted = catalog.slice(0, limit === Infinity ? catalog.length : limit)

for (let i = 0; i < wanted.length; i += 4) {
  const batch = await Promise.all(wanted.slice(i, i + 4).map(async (sheet) => {
    try {
      return [sheet, await get(`${API}/coloring/shared-pages/${sheet.slug}/`)]
    } catch (e) {
      problems.push(`${sheet.slug}: ${e.message}`)
      return null
    }
  }))

  for (const pair of batch) {
    if (!pair) continue
    const [sheet, d] = pair

    if (!OWN_ACCOUNT_IDS.has(d.user?.id)) {
      notOurs.push(sheet.slug)
      continue
    }

    const palette = (d.colors || []).filter(Boolean).map((c) => String(c).toUpperCase())

    // The catalogue is what the website renders. If the API has drifted away
    // from it, the sheet is skipped rather than published with a key that does
    // not match the PDF a reader prints.
    if (d.width !== sheet.w || d.height !== sheet.h || palette.join() !== sheet.hex.join()) {
      problems.push(`${sheet.slug}: upstream no longer matches catalog.json — run \`bun run catalog\` in the web app first`)
      continue
    }

    const grid = toGrid(d.map_numbers, sheet.w, sheet.h)
    const filled = grid.flat().filter((n) => n !== null)
    if (filled.length !== sheet.cells) {
      problems.push(`${sheet.slug}: ${filled.length} filled squares, catalog says ${sheet.cells}`)
      continue
    }
    const used = [...new Set(filled)].sort((a, b) => a - b)
    if (used.some((n) => n >= palette.length)) {
      problems.push(`${sheet.slug}: grid uses a number with no colour in the key`)
      continue
    }

    const collections = HUBS.filter((h) => h.match(sheet)).map((h) => h.id)
    const urls = { en: `${SITE}/page/${sheet.slug}` }
    if (DE.has(sheet.slug)) urls.de = DE.get(sheet.slug).url
    if (FR.has(sheet.slug)) urls.fr = FR.get(sheet.slug).url

    const record = {
      id: sheet.slug,
      name: sheet.name,
      width: sheet.w,
      height: sheet.h,
      squares: sheet.cells,
      colors: palette.length,
      tags: sheet.tags,
      collections,
      // Legend number → colour, exactly as the printed sheet numbers them.
      // Numbering starts at 0 because that is what the PDF prints.
      key: palette.map((hex, number) => ({ number, hex, used: used.includes(number) })),
      // row-major, top-left first; null = a square left blank on the sheet
      grid,
      updated: sheet.updated,
      // The sheet's own page, which is where its printable PDF is offered.
      // No direct link to the PDF: it is rendered on request by a small box
      // behind the website, and a dataset mirrored across npm, jsDelivr and
      // unpkg is not something to point at that box.
      squarecoloring: urls.en,
      urls,
      license: 'CC-BY-4.0',
      credit: `“${sheet.name}” colour-by-number template by SquareColoring — ${urls.en}`
    }

    writeFileSync(join(jsonDir, `${sheet.slug}.json`), JSON.stringify(record, null, 2) + '\n')
    writeFileSync(join(csvDir, `${sheet.slug}.csv`), csvOf(grid))

    index.push({
      id: record.id,
      name: record.name,
      width: record.width,
      height: record.height,
      squares: record.squares,
      colors: record.colors,
      tags: record.tags,
      collections: record.collections,
      squarecoloring: urls.en,
      urls
    })
  }
}

index.sort((a, b) => a.id.localeCompare(b.id))

// Anything that used to be published and no longer is leaves the folder too,
// so `data/` is always exactly what the index says it is.
if (limit === Infinity) {
  const keep = new Set(index.map((t) => t.id))
  for (const [dir, ext] of [[jsonDir, '.json'], [csvDir, '.csv']]) {
    for (const f of readdirSync(dir)) {
      if (f.endsWith(ext) && !keep.has(f.slice(0, -ext.length))) rmSync(join(dir, f))
    }
  }
}

writeFileSync(join(ROOT, 'data', 'index.json'), JSON.stringify({
  name: 'color-by-number-templates',
  source: 'SquareColoring',
  homepage: `${SITE}/printable`,
  license: 'CC-BY-4.0',
  credit: `Colour-by-number templates by SquareColoring (${SITE})`,
  numbering: 'Legend numbers index the key and start at 0, matching the printed PDF.',
  generated: new Date().toISOString().slice(0, 10),
  collections: HUBS.map((h) => ({
    id: h.id,
    title: h.title,
    url: `${SITE}${h.path}`,
    count: index.filter((t) => t.collections.includes(h.id)).length
  })),
  templates: index
}, null, 2) + '\n')

process.stderr.write(`wrote ${index.length} templates\n`)
if (notOurs.length) {
  process.stderr.write(`left out ${notOurs.length} sheet(s) drawn by other members — see SOURCES.md\n`)
}
for (const p of problems) process.stderr.write(`skipped — ${p}\n`)
if (problems.length) process.exitCode = 1
