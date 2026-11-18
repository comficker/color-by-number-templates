# color-by-number-templates

113 modèles de [coloriage magique à imprimer](https://www.squarecoloring.com/fr) en JSON et CSV — la
grille, la légende des couleurs, la taille, les mots-clés — avec une petite bibliothèque et un CLI qui
rend n'importe quel modèle en SVG prêt à imprimer.

Chaque modèle correspond à une fiche sur [SquareColoring](https://www.squarecoloring.com/fr). Les numéros
de ce paquet sont ceux qu'impriment les PDF du site : le fichier et la feuille imprimée ne se contredisent
jamais.

[English](../README.md) · [Deutsch](README.de.md) · [Español](README.es.md) ·
[Português](README.pt.md) · [中文](README.zh.md)

## Installation

```sh
npm install color-by-number-templates
```

Ou seulement les données, ce ne sont que des fichiers :

```
https://cdn.jsdelivr.net/npm/color-by-number-templates/data/index.json
https://cdn.jsdelivr.net/npm/color-by-number-templates/data/json/chubby-bumblebee.json
```

## Utilisation

```js
import { findTemplates, getTemplate, toSVG } from 'color-by-number-templates'

// Ce qu'un enfant de six ans termine : 16 cases de côté au plus, huit couleurs.
const facile = findTemplates({ collection: 'for-kids' })

const t = getTemplate('chubby-bumblebee')
t.key[3]       // { number: 3, hex: '#C9E8EC', used: true }
t.grid[6][4]   // 5 — le numéro imprimé dans cette case ; null veut dire : laisser vide

toSVG(t)                      // la grille numérotée avec sa légende, prête à imprimer
toSVG(t, { solution: true })  // l'image terminée
```

```sh
npx color-by-number list --collection animals --max-colors 8
npx color-by-number chubby-bumblebee --format svg --out bourdon.svg
```

## Les collections

| Collection | Modèles | Contenu |
|---|---|---|
| [Coloriage magique à imprimer](https://www.squarecoloring.com/fr) | 113 | tous |
| [Coloriage magique maternelle](https://www.squarecoloring.com/fr/pour-enfants) | 45 | 16 cases de côté au plus, jusqu'à 8 couleurs |
| [Coloriage magique pour adultes](https://www.squarecoloring.com/fr/pour-adultes) | 42 | 18 cases de côté ou plus, ou 12 couleurs et plus |
| [Coloriage magique animaux](https://www.squarecoloring.com/fr/animaux) | 30 | chats, oiseaux, poissons, insectes |

Chaque modèle a aussi sa page en français : `urls.fr`, par exemple
[Bourdon tout rond](https://www.squarecoloring.com/fr/fiche/bourdon-tout-rond).

## La numérotation commence à 0

Ce n'est pas l'usage, mais c'est ce qu'imprime la feuille — et coller à la feuille compte plus que coller
à l'usage. `key[n]` donne toujours la couleur du numéro `n` dans la grille.

## Licence

Le code de `src/` et `tools/` est sous MIT ([LICENSE](../LICENSE)).
Les modèles de `data/` sont sous **CC BY 4.0** ([LICENSE-DATA](../LICENSE-DATA)) — faites-en ce que vous
voulez, en gardant le crédit :

> Modèles de coloriage magique par SquareColoring (https://www.squarecoloring.com/fr)

## À propos de SquareColoring

[SquareColoring](https://www.squarecoloring.com/fr) transforme de petites grilles de pixels en fiches à
imprimer : A4, Letter, A5 ou carré, en noir et blanc, sans filigrane, sans compte, autant de copies que
vous voulez. La même grille donne quatre fiches — numérotée, contour seul, image terminée, et une grille
de point de croix.
