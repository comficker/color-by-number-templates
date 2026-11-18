/**
 * These tests guard the thing that makes the pack worth downloading: every
 * number in a grid has a colour, every count matches the grid it describes,
 * and every link points at a page that is meant to exist.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  collections, credit, findTemplates, getTemplate, paletteOf,
  templates, toCSV, toColors, toSVG, toText
} from '../src/index.js'

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'data')
const index = JSON.parse(readFileSync(join(DATA, 'index.json'), 'utf8'))

test('the index lists every file in data/json, and nothing more', () => {
  const onDisk = readdirSync(join(DATA, 'json')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5))
  assert.deepEqual([...onDisk].sort(), templates.map((t) => t.id).sort())
})

test('every template has a CSV of the same grid', () => {
  for (const t of templates) {
    const full = getTemplate(t.id)
    const csv = readFileSync(join(DATA, 'csv', `${t.id}.csv`), 'utf8')
    assert.equal(csv, toCSV(full), `${t.id}: CSV does not match the JSON grid`)
  }
})

test('grids are rectangular and match their stated size', () => {
  for (const t of templates) {
    const full = getTemplate(t.id)
    assert.equal(full.grid.length, t.height, `${t.id}: wrong number of rows`)
    for (const row of full.grid) assert.equal(row.length, t.width, `${t.id}: ragged row`)
  }
})

test('every number in a grid has a colour in the key', () => {
  for (const t of templates) {
    const full = getTemplate(t.id)
    for (const row of full.grid) {
      for (const n of row) {
        if (n === null) continue
        assert.ok(Number.isInteger(n) && n >= 0 && n < full.key.length, `${t.id}: number ${n} has no colour`)
      }
    }
  }
})

test('the key is numbered from 0 with no gaps, and every colour is a hex triple', () => {
  for (const t of templates) {
    const full = getTemplate(t.id)
    full.key.forEach((k, i) => {
      assert.equal(k.number, i, `${t.id}: key is not numbered in order`)
      assert.match(k.hex, /^#[0-9A-F]{6}$/, `${t.id}: ${k.hex} is not a hex colour`)
    })
    assert.equal(full.key.length, t.colors)
  }
})

test('`used` says exactly which colours the grid actually uses', () => {
  for (const t of templates) {
    const full = getTemplate(t.id)
    const inGrid = new Set(full.grid.flat().filter((n) => n !== null))
    for (const k of full.key) {
      assert.equal(k.used, inGrid.has(k.number), `${t.id}: colour ${k.number} is marked used=${k.used}`)
    }
  }
})

test('the square count is the number of squares that carry a number', () => {
  for (const t of templates) {
    const full = getTemplate(t.id)
    assert.equal(full.grid.flat().filter((n) => n !== null).length, t.squares, `${t.id}: wrong square count`)
  }
})

test('every URL is an https squarecoloring.com page, and matches the id', () => {
  for (const t of templates) {
    assert.equal(t.urls.en, `https://www.squarecoloring.com/page/${t.id}`)
    for (const url of Object.values(t.urls)) {
      assert.match(url, /^https:\/\/www\.squarecoloring\.com\//, `${t.id}: ${url}`)
    }
    const full = getTemplate(t.id)
    assert.equal(full.squarecoloring, t.urls.en)
    assert.ok(full.credit.includes(t.urls.en), `${t.id}: credit line has no link back`)
  }
})

test('collections are the ones the website has, and the counts are right', () => {
  assert.deepEqual(
    collections.map((c) => c.id).sort(),
    ['animals', 'for-adults', 'for-kids', 'pixel-art', 'printables']
  )
  for (const c of collections) {
    assert.equal(c.count, templates.filter((t) => t.collections.includes(c.id)).length, `${c.id}: wrong count`)
    assert.ok(c.url.startsWith('https://www.squarecoloring.com/printable'), `${c.id}: ${c.url}`)
  }
  for (const t of templates) {
    assert.ok(t.collections.includes('printables'), `${t.id}: not in the main collection`)
    for (const id of t.collections) {
      assert.ok(collections.some((c) => c.id === id), `${t.id}: unknown collection ${id}`)
    }
  }
})

test('the kids collection really is the easy half', () => {
  for (const t of findTemplates({ collection: 'for-kids' })) {
    assert.ok(Math.max(t.width, t.height) <= 16 && t.colors <= 8, `${t.id} is not a kids sheet`)
  }
})

test('findTemplates applies every filter it is given', () => {
  assert.equal(findTemplates().length, templates.length)
  for (const t of findTemplates({ maxSize: 12, maxColors: 6 })) {
    assert.ok(Math.max(t.width, t.height) <= 12 && t.colors <= 6)
  }
  for (const t of findTemplates({ tag: 'animal' })) assert.ok(t.tags.includes('animal'))
  for (const t of findTemplates({ search: 'cat' })) {
    assert.match(`${t.name} ${t.tags.join(' ')}`.toLowerCase(), /cat/)
  }
  assert.equal(findTemplates({ collection: 'no-such-collection' }).length, 0)
})

test('getTemplate refuses anything that is not an id', () => {
  assert.equal(getTemplate('../package'), null)
  assert.equal(getTemplate('/etc/passwd'), null)
  assert.equal(getTemplate('nope-not-here'), null)
})

test('renderers accept an id as well as a template', () => {
  const id = templates[0].id
  assert.equal(toCSV(id), toCSV(getTemplate(id)))
  assert.deepEqual(paletteOf(id), getTemplate(id).key)
})

test('the solution grid is the grid with its colours filled in', () => {
  const t = getTemplate(templates[0].id)
  const colored = toColors(t)
  t.grid.forEach((row, y) => row.forEach((n, x) => {
    assert.equal(colored[y][x], n === null ? null : t.key[n].hex)
  }))
})

test('text output has one line per row and marks blanks with a dot', () => {
  const t = getTemplate(templates[0].id)
  const lines = toText(t).split('\n')
  assert.equal(lines.length, t.height)
  assert.ok(lines.join('').includes('.') === t.grid.flat().includes(null))
})

test('SVG output is well-formed, carries the name and shows every used colour', () => {
  const t = getTemplate(templates[0].id)
  const svg = toSVG(t)
  assert.ok(svg.startsWith('<svg ') && svg.trimEnd().endsWith('</svg>'))
  assert.ok(svg.includes(t.name))
  for (const k of t.key.filter((k) => k.used)) assert.ok(svg.includes(k.hex), `key ${k.number} missing`)
  assert.ok(toSVG(t, { solution: true }).includes(`fill="${t.key.find((k) => k.used).hex}"`))
  assert.ok(!toSVG(t, { key: false }).includes('COLOUR KEY'))
})

test('the credit line names the site and links to it', () => {
  assert.ok(credit.includes('SquareColoring'))
  assert.ok(credit.includes('https://www.squarecoloring.com'))
  assert.equal(index.license, 'CC-BY-4.0')
})

test('every README repeats the real collection counts', () => {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  const files = ['README.md', 'CATALOG.md', ...readdirSync(join(root, 'i18n')).map((f) => join('i18n', f))]
  const total = templates.length
  for (const file of files) {
    const text = readFileSync(join(root, file), 'utf8')
    for (const c of collections) {
      // The collection tables are "| <link to the hub> | <count> |".
      const m = text.match(new RegExp(`\\(${c.url.replace(/[.*+?^$()|[\\]\\\\]/g, '\\\\$&')}\\)[^|]*\\|\\s*(\\d+)\\s*\\|`))
      if (m) assert.equal(Number(m[1]), c.count, `${file}: ${c.id} is listed as ${m[1]}, not ${c.count}`)
    }
    if (file !== 'CATALOG.md') {
      assert.ok(text.includes(String(total)), `${file}: does not mention the ${total} templates it ships`)
    }
  }
})

test('the README example is a template that exists', () => {
  const text = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'README.md'), 'utf8')
  for (const [, id] of text.matchAll(/getTemplate\('([a-z0-9-]+)'\)/g)) {
    assert.ok(getTemplate(id), `README shows getTemplate('${id}') but there is no such template`)
  }
})

test('nothing shipped points at the backend or carries a person', () => {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..')
  // Everything in `files` of package.json, plus the README npm renders.
  const shipped = [
    'README.md', 'CATALOG.md', 'SOURCES.md', 'LICENSE', 'LICENSE-DATA', 'package.json',
    ...readdirSync(join(root, 'src')).map((f) => join('src', f)),
    ...readdirSync(join(root, 'i18n')).map((f) => join('i18n', f)),
    'data/index.json',
    ...templates.slice(0, 20).map((t) => join('data', 'json', `${t.id}.json`))
  ]
  for (const file of shipped) {
    const text = readFileSync(join(root, file), 'utf8')
    assert.ok(!text.includes('touch.ninosaur.com'), `${file}: links straight at the render box`)
    // The sheets are credited to the site, not to the person who drew them,
    // and no account name or address belongs in a published dataset.
    assert.ok(!/[\w.+-]+@[\w-]+\.[\w.]+/.test(text), `${file}: contains an email address`)
  }
  for (const t of templates) {
    const full = getTemplate(t.id)
    assert.ok(!('printPdf' in full), `${t.id}: still carries a PDF link`)
    for (const field of ['user', 'username', 'author', 'owner', 'email']) {
      assert.ok(!(field in full), `${t.id}: carries a "${field}" field`)
    }
  }
})
