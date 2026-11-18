# color-by-number-templates

113 plantillas de [colorear por números para imprimir](https://www.squarecoloring.com/printable) en JSON
y CSV — la cuadrícula, la clave de colores, el tamaño, las etiquetas — más una pequeña biblioteca y un CLI
que convierte cualquier plantilla en un SVG listo para imprimir.

Cada plantilla es una lámina de [SquareColoring](https://www.squarecoloring.com/printable). Los números de
este paquete son los mismos que imprimen sus PDF, así que el archivo y la hoja impresa nunca se
contradicen.

> El sitio está en inglés, alemán y francés; los enlaces de esta página llevan a las páginas en inglés.

[English](../README.md) · [Deutsch](README.de.md) · [Français](README.fr.md) ·
[Português](README.pt.md) · [中文](README.zh.md)

## Instalación

```sh
npm install color-by-number-templates
```

O solo los datos, que son archivos corrientes:

```
https://cdn.jsdelivr.net/npm/color-by-number-templates/data/index.json
https://cdn.jsdelivr.net/npm/color-by-number-templates/data/json/chubby-bumblebee.json
```

## Uso

```js
import { findTemplates, getTemplate, toSVG } from 'color-by-number-templates'

// Lo que termina un niño de seis años: 16 casillas de lado como mucho, ocho colores.
const faciles = findTemplates({ collection: 'for-kids' })

const t = getTemplate('chubby-bumblebee')
t.key[3]       // { number: 3, hex: '#C9E8EC', used: true }
t.grid[6][4]   // 5 — el número impreso en esa casilla; null significa dejarla en blanco

toSVG(t)                      // la cuadrícula numerada con su clave, lista para imprimir
toSVG(t, { solution: true })  // el dibujo terminado
```

```sh
npx color-by-number list --collection animals --max-colors 8
npx color-by-number chubby-bumblebee --format svg --out abejorro.svg
```

## Las colecciones

| Colección | Plantillas | Contenido |
|---|---|---|
| [Colorear por números para imprimir](https://www.squarecoloring.com/printable) | 113 | todas |
| [Colorear por números para niños](https://www.squarecoloring.com/printable/for-kids) | 45 | 16 casillas de lado como mucho, hasta 8 colores |
| [Colorear por números para adultos](https://www.squarecoloring.com/printable/for-adults) | 42 | 18 casillas de lado o más, o 12 colores o más |
| [Animales para colorear por números](https://www.squarecoloring.com/printable/animals) | 30 | gatos, pájaros, peces, insectos |
| [Pixel art para colorear por números](https://www.squarecoloring.com/printable/pixel-art) | 84 | tamaño sprite: 16×16 o menos |

## La numeración empieza en 0

No es lo habitual, pero es lo que imprime la hoja, y coincidir con la hoja importa más que coincidir con
la costumbre. `key[n]` siempre es el color del número `n` de la cuadrícula.

## Licencia

El código de `src/` y `tools/` está bajo MIT ([LICENSE](../LICENSE)).
Las plantillas de `data/` están bajo **CC BY 4.0** ([LICENSE-DATA](../LICENSE-DATA)): úsalas para lo que
quieras, manteniendo el crédito:

> Plantillas de colorear por números de SquareColoring (https://www.squarecoloring.com)

## Sobre SquareColoring

[SquareColoring](https://www.squarecoloring.com) convierte cuadrículas pequeñas de píxeles en láminas para
imprimir: A4, Letter, A5 o cuadrada, en blanco y negro, sin marca de agua, sin cuenta y sin límite de
copias. De la misma cuadrícula salen cuatro láminas: numerada, solo contorno, el dibujo terminado y un
patrón de punto de cruz.
