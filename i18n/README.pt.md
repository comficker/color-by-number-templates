# color-by-number-templates

113 modelos de [colorir por números para imprimir](https://www.squarecoloring.com/printable) em JSON e
CSV — a grelha, a chave de cores, o tamanho, as etiquetas — mais uma pequena biblioteca e um CLI que
transforma qualquer modelo num SVG pronto a imprimir.

Cada modelo é uma folha do [SquareColoring](https://www.squarecoloring.com/printable). Os números deste
pacote são os mesmos que os PDF do site imprimem, por isso o ficheiro e a folha impressa nunca se
contradizem.

> O site está em inglês, alemão e francês; as ligações desta página vão para as páginas em inglês.

[English](../README.md) · [Deutsch](README.de.md) · [Français](README.fr.md) ·
[Español](README.es.md) · [中文](README.zh.md)

## Instalação

```sh
npm install color-by-number-templates
```

Ou só os dados, são ficheiros simples:

```
https://cdn.jsdelivr.net/npm/color-by-number-templates/data/index.json
https://cdn.jsdelivr.net/npm/color-by-number-templates/data/json/chubby-bumblebee.json
```

## Utilização

```js
import { findTemplates, getTemplate, toSVG } from 'color-by-number-templates'

// O que uma criança de seis anos acaba: 16 quadrados de lado no máximo, oito cores.
const faceis = findTemplates({ collection: 'for-kids' })

const t = getTemplate('chubby-bumblebee')
t.key[3]       // { number: 3, hex: '#C9E8EC', used: true }
t.grid[6][4]   // 5 — o número impresso nesse quadrado; null quer dizer deixar em branco

toSVG(t)                      // a grelha numerada com a chave, pronta a imprimir
toSVG(t, { solution: true })  // o desenho acabado
```

```sh
npx color-by-number list --collection animals --max-colors 8
npx color-by-number chubby-bumblebee --format svg --out abelhao.svg
```

## As colecções

| Colecção | Modelos | Conteúdo |
|---|---|---|
| [Colorir por números para imprimir](https://www.squarecoloring.com/printable) | 113 | todos |
| [Colorir por números para crianças](https://www.squarecoloring.com/printable/for-kids) | 45 | 16 quadrados de lado no máximo, até 8 cores |
| [Colorir por números para adultos](https://www.squarecoloring.com/printable/for-adults) | 42 | 18 quadrados de lado ou mais, ou 12 cores ou mais |
| [Animais para colorir por números](https://www.squarecoloring.com/printable/animals) | 30 | gatos, aves, peixes, insectos |
| [Pixel art para colorir por números](https://www.squarecoloring.com/printable/pixel-art) | 84 | tamanho sprite: 16×16 ou menos |

## A numeração começa em 0

Não é o habitual, mas é o que a folha imprime — e corresponder à folha importa mais do que corresponder ao
costume. `key[n]` é sempre a cor do número `n` na grelha.

## Licença

O código em `src/` e `tools/` é MIT ([LICENSE](../LICENSE)).
Os modelos em `data/` são **CC BY 4.0** ([LICENSE-DATA](../LICENSE-DATA)) — use-os para o que quiser,
mantendo o crédito:

> Modelos de colorir por números por SquareColoring (https://www.squarecoloring.com)

## Sobre o SquareColoring

O [SquareColoring](https://www.squarecoloring.com) transforma pequenas grelhas de píxeis em folhas para
imprimir: A4, Letter, A5 ou quadrada, a preto e branco, sem marca de água, sem conta e sem limite de
cópias. Da mesma grelha saem quatro folhas — numerada, só contorno, o desenho acabado e um padrão de ponto
de cruz.
