#!/usr/bin/env node
/**
 * color-by-number — print a template, or list what is in the pack.
 *
 *   color-by-number list --collection for-kids
 *   color-by-number monarch-butterfly --format svg > butterfly.svg
 */
import { writeFileSync } from 'node:fs'
import { collections, findTemplates, getTemplate, toCSV, toSVG, toText } from './index.js'

const BOOLEAN = new Set(['solution', 'no-key', 'help'])

const positional = []
const flags = new Map()
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i]
  if (!a.startsWith('--')) { positional.push(a); continue }
  const name = a.slice(2)
  if (BOOLEAN.has(name)) flags.set(name, true)
  else flags.set(name, process.argv[++i])
}

const flag = (name, fallback) => (flags.has(name) ? flags.get(name) : fallback)
const has = (name) => flags.get(name) === true

const usage = `color-by-number — free colour-by-number templates from squarecoloring.com

  color-by-number list [--collection <id>] [--tag <t>] [--max-size n] [--max-colors n] [--search s]
  color-by-number <template-id> [--format json|csv|txt|svg] [--cell n] [--solution] [--no-key] [--out file]
  color-by-number collections

Printable PDFs of every template: https://www.squarecoloring.com/printable
`

const [command, ...rest] = positional

if (!command || has('help')) {
  process.stdout.write(usage)
  process.exit(command ? 0 : 1)
}

if (command === 'collections') {
  for (const c of collections) {
    process.stdout.write(`${c.id.padEnd(12)} ${String(c.count).padStart(3)}  ${c.title} — ${c.url}\n`)
  }
  process.exit(0)
}

if (command === 'list') {
  const num = (name) => (flag(name) === undefined ? undefined : Number(flag(name)))
  const found = findTemplates({
    collection: flag('collection'),
    tag: flag('tag'),
    maxSize: num('max-size'),
    minSize: num('min-size'),
    maxColors: num('max-colors'),
    minColors: num('min-colors'),
    search: flag('search')
  })
  for (const t of found) {
    process.stdout.write(`${t.id.padEnd(34)} ${`${t.width}×${t.height}`.padStart(7)} ${String(t.colors).padStart(3)} colours  ${t.name}\n`)
  }
  process.stderr.write(`${found.length} template${found.length === 1 ? '' : 's'}\n`)
  process.exit(0)
}

const id = command
const template = getTemplate(id)
if (!template) {
  process.stderr.write(`no template "${id}" — try \`color-by-number list --search ${id.split('-')[0]}\`\n`)
  process.exit(1)
}

const format = flag('format', 'json')
let out
switch (format) {
  case 'json': out = JSON.stringify(template, null, 2) + '\n'; break
  case 'csv': out = toCSV(template); break
  case 'txt': out = toText(template) + '\n'; break
  case 'svg': out = toSVG(template, {
    cell: Number(flag('cell', 32)),
    solution: has('solution'),
    key: !has('no-key')
  }) + '\n'; break
  default:
    process.stderr.write(`unknown format "${format}" — use json, csv, txt or svg\n`)
    process.exit(1)
}

const file = flag('out')
if (file) {
  writeFileSync(file, out)
  process.stderr.write(`${file}\n`)
} else {
  process.stdout.write(out)
}

if (rest.length) process.stderr.write(`ignored: ${rest.join(' ')}\n`)
