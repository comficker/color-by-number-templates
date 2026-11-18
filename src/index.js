/**
 * color-by-number-templates — read and render the templates in `data/`.
 *
 * Everything here works offline; the URLs in each record point back at the
 * sheet's page on SquareColoring, where the same template is a print-ready
 * A4/Letter PDF: https://www.squarecoloring.com/printable
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'data')

const index = JSON.parse(readFileSync(join(DATA, 'index.json'), 'utf8'))

/** Every template, without its grid. */
export const templates = index.templates

/** The collections on squarecoloring.com, with the URL of each. */
export const collections = index.collections

/** Credit line to use when you publish something built from this data. */
export const credit = index.credit

const cache = new Map()

/**
 * One template, grid and colour key included.
 * @param {string} id
 * @returns {object|null} null when there is no template with that id
 */
export function getTemplate (id) {
  if (cache.has(id)) return cache.get(id)
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(String(id))) return null
  const file = join(DATA, 'json', `${id}.json`)
  if (!existsSync(file)) return null
  const t = JSON.parse(readFileSync(file, 'utf8'))
  cache.set(id, t)
  return t
}

/**
 * Templates matching every option given.
 * @param {{collection?: string, tag?: string, maxSize?: number, minSize?: number,
 *          maxColors?: number, minColors?: number, search?: string}} [options]
 */
export function findTemplates (options = {}) {
  const { collection, tag, maxSize, minSize, maxColors, minColors, search } = options
  const needle = search ? String(search).toLowerCase() : null
  return templates.filter((t) => {
    if (collection && !t.collections.includes(collection)) return false
    if (tag && !t.tags.includes(tag)) return false
    const side = Math.max(t.width, t.height)
    if (maxSize !== undefined && side > maxSize) return false
    if (minSize !== undefined && side < minSize) return false
    if (maxColors !== undefined && t.colors > maxColors) return false
    if (minColors !== undefined && t.colors < minColors) return false
    if (needle && !`${t.name} ${t.tags.join(' ')}`.toLowerCase().includes(needle)) return false
    return true
  })
}

/**
 * The colour key, legend number first. Numbers start at 0, the same as on the
 * printed sheet.
 */
export function paletteOf (template) {
  const t = typeof template === 'string' ? getTemplate(template) : template
  return t ? t.key : []
}

/** The grid as rows of numbers, `null` for a square left blank. */
export function toGrid (template) {
  const t = typeof template === 'string' ? getTemplate(template) : template
  return t ? t.grid : []
}

/** The grid as rows of hex colours, `null` for a blank square — the solution. */
export function toColors (template) {
  const t = typeof template === 'string' ? getTemplate(template) : template
  if (!t) return []
  return t.grid.map((row) => row.map((n) => (n === null ? null : t.key[n].hex)))
}

/** The grid as text, one line per row, `.` for a blank square. */
export function toText (template, { separator = ' ' } = {}) {
  const t = typeof template === 'string' ? getTemplate(template) : template
  if (!t) return ''
  const pad = String(t.colors - 1).length
  return t.grid
    .map((row) => row.map((n) => (n === null ? '.'.padStart(pad) : String(n).padStart(pad))).join(separator))
    .join('\n')
}

/** The grid as CSV, blank squares as empty fields. */
export function toCSV (template) {
  const t = typeof template === 'string' ? getTemplate(template) : template
  if (!t) return ''
  return t.grid.map((row) => row.map((n) => (n === null ? '' : n)).join(',')).join('\n') + '\n'
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

/** Black text on a light square, white on a dark one. */
const ink = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b) > 0.36 ? '#000' : '#fff'
}

/**
 * The template as a standalone SVG: the numbered grid, or the finished
 * picture when `solution` is set. Print it, or drop it into a page.
 *
 * @param {object|string} template
 * @param {{cell?: number, solution?: boolean, majorRule?: number, key?: boolean}} [options]
 */
export function toSVG (template, options = {}) {
  const t = typeof template === 'string' ? getTemplate(template) : template
  if (!t) return ''
  const { cell = 32, solution = false, majorRule = 5, key = true } = options

  const gridW = t.width * cell
  const gridH = t.height * cell
  const used = t.key.filter((k) => k.used)
  const perRow = Math.max(1, Math.floor(gridW / 110))
  const keyRows = key ? Math.ceil(used.length / perRow) : 0
  const keyH = key ? 18 + keyRows * 26 : 0
  const pad = 16
  const width = gridW + pad * 2
  const height = gridH + pad * 2 + keyH + 22

  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(t.name)} colour by number">`,
    `<title>${esc(t.name)} — colour by number</title>`,
    `<rect width="${width}" height="${height}" fill="#fff"/>`,
    `<g font-family="Helvetica, Arial, sans-serif">`
  ]

  for (let y = 0; y < t.height; y++) {
    for (let x = 0; x < t.width; x++) {
      const n = t.grid[y][x]
      const px = pad + x * cell
      const py = pad + y * cell
      if (n === null) {
        parts.push(`<rect x="${px}" y="${py}" width="${cell}" height="${cell}" fill="#fff" stroke="#e5e5e5"/>`)
        continue
      }
      const hex = t.key[n].hex
      if (solution) {
        parts.push(`<rect x="${px}" y="${py}" width="${cell}" height="${cell}" fill="${hex}" stroke="#00000014"/>`)
      } else {
        parts.push(`<rect x="${px}" y="${py}" width="${cell}" height="${cell}" fill="#fff" stroke="#9a9a9a"/>`)
        parts.push(`<text x="${px + cell / 2}" y="${py + cell / 2}" font-size="${(cell * 0.46).toFixed(1)}" text-anchor="middle" dominant-baseline="central" fill="#222">${n}</text>`)
      }
    }
  }

  // Heavier line every few squares, so the eye can count across the grid.
  if (majorRule > 0) {
    for (let x = majorRule; x < t.width; x += majorRule) {
      parts.push(`<line x1="${pad + x * cell}" y1="${pad}" x2="${pad + x * cell}" y2="${pad + gridH}" stroke="#444" stroke-width="1.5"/>`)
    }
    for (let y = majorRule; y < t.height; y += majorRule) {
      parts.push(`<line x1="${pad}" y1="${pad + y * cell}" x2="${pad + gridW}" y2="${pad + y * cell}" stroke="#444" stroke-width="1.5"/>`)
    }
  }
  parts.push(`<rect x="${pad}" y="${pad}" width="${gridW}" height="${gridH}" fill="none" stroke="#222" stroke-width="2"/>`)

  if (key) {
    const top = pad + gridH + 18
    parts.push(`<text x="${pad}" y="${top + 2}" font-size="12" fill="#666" letter-spacing="1.2">COLOUR KEY</text>`)
    used.forEach((k, i) => {
      const cx = pad + (i % perRow) * (gridW / perRow)
      const cy = top + 16 + Math.floor(i / perRow) * 26
      parts.push(`<rect x="${cx}" y="${cy}" width="22" height="22" rx="3" fill="${k.hex}" stroke="#bbb"/>`)
      parts.push(`<text x="${cx + 11}" y="${cy + 11}" font-size="11" text-anchor="middle" dominant-baseline="central" fill="${ink(k.hex)}">${k.number}</text>`)
      parts.push(`<text x="${cx + 28}" y="${cy + 11}" font-size="11" dominant-baseline="central" fill="#333">${esc(k.hex)}</text>`)
    })
  }

  parts.push(`<text x="${pad}" y="${height - 8}" font-size="11" fill="#888">${esc(t.name)} · squarecoloring.com</text>`)
  parts.push('</g></svg>')
  return parts.join('\n')
}

export default { templates, collections, credit, getTemplate, findTemplates, paletteOf, toGrid, toColors, toText, toCSV, toSVG }
