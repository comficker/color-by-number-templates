/**
 * Rewrite the generated tables in README.md and CATALOG.md from `data/`.
 *
 * The prose around them is written by hand; only what sits between the
 * `<!-- templates:start -->` / `<!-- templates:end -->` markers is replaced,
 * so a rebuild can never leave the README claiming a template that is gone.
 *
 *   node tools/build-readme.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const index = JSON.parse(readFileSync(join(ROOT, 'data', 'index.json'), 'utf8'))
const byId = Object.fromEntries(index.collections.map((c) => [c.id, c]))

const row = (t) => {
  const home = byId[t.collections.find((c) => c !== 'printables') || 'printables']
  return `| [${t.name}](${t.urls.en}) | ${t.width}×${t.height} | ${t.colors} | ${t.squares} | [${home.title}](${home.url}) | \`data/json/${t.id}.json\` |`
}

const HEAD = [
  '| Template | Grid | Colours | Squares | Collection | File |',
  '|---|---|---|---|---|---|'
]

const MARKERS = /<!-- templates:start -->[\s\S]*?<!-- templates:end -->/

const replace = (file, body) => {
  const path = join(ROOT, file)
  const text = readFileSync(path, 'utf8')
  // Missing markers and an unchanged table look the same to `replace`, and
  // only one of them is a problem, so check for them separately.
  if (!MARKERS.test(text)) throw new Error(`${file}: markers not found`)
  writeFileSync(path, text.replace(MARKERS, `<!-- templates:start -->\n${body}\n<!-- templates:end -->`))
}

/* README: a few from each collection, so the preview is not all butterflies. */
const sample = []
for (const c of index.collections) {
  if (c.id === 'printables') continue
  const pick = index.templates.filter((t) => t.collections.includes(c.id))
  for (const t of pick.slice(0, 4)) if (!sample.includes(t)) sample.push(t)
}
replace('README.md', [...HEAD, ...sample.map(row)].join('\n'))

/* CATALOG: everything, grouped by collection. */
const catalog = []
for (const c of index.collections) {
  const list = index.templates.filter((t) => t.collections.includes(c.id))
  catalog.push(`\n## [${c.title}](${c.url})\n`, `${list.length} templates.\n`, ...HEAD, ...list.map(row))
}
replace('CATALOG.md', catalog.join('\n'))

process.stderr.write(`README: ${sample.length} rows · CATALOG: ${index.templates.length} templates\n`)
