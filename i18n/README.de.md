# color-by-number-templates

113 Vorlagen für [Malen nach Zahlen zum Ausdrucken](https://www.squarecoloring.com/de) als schlichtes
JSON und CSV — das Raster, der Farbschlüssel, die Größe, die Schlagwörter — dazu eine kleine Bibliothek
und ein CLI, das jede Vorlage als druckfertiges SVG ausgibt.

Jede Vorlage gehört zu einem Blatt auf [SquareColoring](https://www.squarecoloring.com/de). Die Zahlen in
diesem Paket sind dieselben, die auf den PDFs der Seite stehen — Datei und gedrucktes Blatt widersprechen
sich nie.

[English](../README.md) · [Français](README.fr.md) · [Español](README.es.md) ·
[Português](README.pt.md) · [中文](README.zh.md)

## Installation

```sh
npm install color-by-number-templates
```

Oder nur die Daten, das sind einfache Dateien:

```
https://cdn.jsdelivr.net/npm/color-by-number-templates/data/index.json
https://cdn.jsdelivr.net/npm/color-by-number-templates/data/json/chubby-bumblebee.json
```

## Benutzung

```js
import { findTemplates, getTemplate, toSVG } from 'color-by-number-templates'

// Alles, was ein Sechsjähriger schafft: höchstens 16 Kästchen pro Seite, acht Farben.
const einfach = findTemplates({ collection: 'for-kids' })

const t = getTemplate('chubby-bumblebee')
t.key[3]       // { number: 3, hex: '#C9E8EC', used: true }
t.grid[6][4]   // 5 — die Zahl in diesem Kästchen; null heißt: leer lassen

toSVG(t)                      // das Zahlenraster mit Farbschlüssel, fertig zum Drucken
toSVG(t, { solution: true })  // das fertige Bild
```

```sh
npx color-by-number list --collection animals --max-colors 8
npx color-by-number chubby-bumblebee --format svg --out hummel.svg
```

## Die Sammlungen

| Sammlung | Vorlagen | Inhalt |
|---|---|---|
| [Malen nach Zahlen zum Ausdrucken](https://www.squarecoloring.com/de) | 113 | alle |
| [Malen nach Zahlen für Kinder](https://www.squarecoloring.com/de/fuer-kinder) | 45 | höchstens 16 Kästchen pro Seite, bis zu 8 Farben |
| [Malen nach Zahlen für Erwachsene](https://www.squarecoloring.com/de/fuer-erwachsene) | 42 | ab 18 Kästchen pro Seite oder ab 12 Farben |
| [Tiere — Malen nach Zahlen](https://www.squarecoloring.com/de/tiere) | 30 | Katzen, Vögel, Fische, Käfer |

Jede Vorlage hat auch eine deutsche Seite: `urls.de`, zum Beispiel
[Pummelige Hummel](https://www.squarecoloring.com/de/vorlage/pummelige-hummel).

## Die Zahlen beginnen bei 0

Das entspricht nicht der üblichen Zählweise, aber genau so steht es auf dem gedruckten Blatt — und zur
Vorlage zu passen ist wichtiger als zur Konvention. `key[n]` ist immer die Farbe zur Zahl `n` im Raster.

## Lizenz

Der Code in `src/` und `tools/` steht unter MIT ([LICENSE](../LICENSE)).
Die Vorlagen in `data/` stehen unter **CC BY 4.0** ([LICENSE-DATA](../LICENSE-DATA)) — benutzen Sie sie,
wofür Sie wollen, nennen Sie nur die Quelle:

> Vorlagen für Malen nach Zahlen von SquareColoring (https://www.squarecoloring.com/de)

## Über SquareColoring

[SquareColoring](https://www.squarecoloring.com/de) macht aus kleinen Pixelrastern Blätter zum Ausdrucken:
A4, Letter, A5 oder quadratisch, schwarz-weiß, ohne Wasserzeichen, ohne Konto, so viele Kopien wie Sie
wollen. Aus demselben Raster entstehen vier Blattarten — mit Zahlen, als leere Umrisse, das fertige Bild
und eine Stickvorlage.
