/** A colour in a template's key. Numbers start at 0, as printed on the sheet. */
export interface KeyColor {
  number: number
  hex: string
  /** false when the grid never uses this colour. */
  used: boolean
}

/** A template without its grid, as listed in `data/index.json`. */
export interface TemplateSummary {
  id: string
  name: string
  width: number
  height: number
  /** Squares that carry a number; the rest of the grid is blank. */
  squares: number
  colors: number
  tags: string[]
  collections: string[]
  /** The sheet's page on squarecoloring.com, which offers the printable PDF. */
  squarecoloring: string
  urls: { en: string, de?: string, fr?: string }
}

export interface Template extends TemplateSummary {
  key: KeyColor[]
  /** Rows, top-left first. `null` is a square left blank on the sheet. */
  grid: Array<Array<number | null>>
  updated: string
  license: 'CC-BY-4.0'
  credit: string
}

export interface Collection {
  id: string
  title: string
  url: string
  count: number
}

export interface FindOptions {
  collection?: string
  tag?: string
  maxSize?: number
  minSize?: number
  maxColors?: number
  minColors?: number
  search?: string
}

export interface SVGOptions {
  /** Square size in SVG units. Default 32. */
  cell?: number
  /** Fill the squares instead of numbering them. Default false. */
  solution?: boolean
  /** Heavier line every n squares; 0 turns it off. Default 5. */
  majorRule?: number
  /** Draw the colour key under the grid. Default true. */
  key?: boolean
}

export declare const templates: TemplateSummary[]
export declare const collections: Collection[]
export declare const credit: string

export declare function getTemplate (id: string): Template | null
export declare function findTemplates (options?: FindOptions): TemplateSummary[]
export declare function paletteOf (template: Template | string): KeyColor[]
export declare function toGrid (template: Template | string): Array<Array<number | null>>
export declare function toColors (template: Template | string): Array<Array<string | null>>
export declare function toText (template: Template | string, options?: { separator?: string }): string
export declare function toCSV (template: Template | string): string
export declare function toSVG (template: Template | string, options?: SVGOptions): string

declare const _default: {
  templates: TemplateSummary[]
  collections: Collection[]
  credit: string
  getTemplate: typeof getTemplate
  findTemplates: typeof findTemplates
  paletteOf: typeof paletteOf
  toGrid: typeof toGrid
  toColors: typeof toColors
  toText: typeof toText
  toCSV: typeof toCSV
  toSVG: typeof toSVG
}
export default _default
