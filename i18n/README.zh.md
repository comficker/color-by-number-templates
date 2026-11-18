# color-by-number-templates

113 份[可打印的数字填色模板](https://www.squarecoloring.com/printable)，以纯 JSON 和 CSV 提供 —— 方格图、
配色表、尺寸、标签 —— 另附一个小型库和命令行工具，可把任意模板渲染成可直接打印的 SVG。

每份模板都对应 [SquareColoring](https://www.squarecoloring.com/printable) 上的一张图纸。本数据包里的数字
与该站 PDF 上印出来的数字完全一致，文件与印纸不会对不上。

> 网站本身提供英文、德文和法文；本页链接指向英文页面。

[English](../README.md) · [Deutsch](README.de.md) · [Français](README.fr.md) ·
[Español](README.es.md) · [Português](README.pt.md)

## 安装

```sh
npm install color-by-number-templates
```

或者只取数据，它们就是普通文件：

```
https://cdn.jsdelivr.net/npm/color-by-number-templates/data/index.json
https://cdn.jsdelivr.net/npm/color-by-number-templates/data/json/chubby-bumblebee.json
```

## 用法

```js
import { findTemplates, getTemplate, toSVG } from 'color-by-number-templates'

// 六岁孩子能画完的那些：每边最多 16 格，八种颜色。
const easy = findTemplates({ collection: 'for-kids' })

const t = getTemplate('chubby-bumblebee')
t.key[3]       // { number: 3, hex: '#C9E8EC', used: true }
t.grid[6][4]   // 5 —— 该格要印的数字；null 表示留白

toSVG(t)                      // 带配色表的数字方格图，可直接打印
toSVG(t, { solution: true })  // 填好色的完成图
```

```sh
npx color-by-number list --collection animals --max-colors 8
npx color-by-number chubby-bumblebee --format svg --out bumblebee.svg
```

## 分类

| 分类 | 模板数 | 内容 |
|---|---|---|
| [可打印数字填色](https://www.squarecoloring.com/printable) | 113 | 全部 |
| [儿童数字填色](https://www.squarecoloring.com/printable/for-kids) | 45 | 每边不超过 16 格，最多 8 色 |
| [成人数字填色](https://www.squarecoloring.com/printable/for-adults) | 42 | 每边 18 格以上，或 12 色以上 |
| [动物数字填色](https://www.squarecoloring.com/printable/animals) | 30 | 猫、鸟、鱼、昆虫 |
| [像素画数字填色](https://www.squarecoloring.com/printable/pixel-art) | 84 | 精灵图尺寸：16×16 及以下 |

## 编号从 0 开始

这不是常见做法，但印纸上就是这样编的；与印纸一致比与惯例一致更要紧。`key[n]` 始终是方格中数字 `n` 对应
的颜色。

## 许可

`src/` 与 `tools/` 中的代码采用 MIT 许可（[LICENSE](../LICENSE)）。
`data/` 中的模板采用 **CC BY 4.0**（[LICENSE-DATA](../LICENSE-DATA)）—— 随意使用，保留署名即可：

> Colour-by-number templates by SquareColoring (https://www.squarecoloring.com)

## 关于 SquareColoring

[SquareColoring](https://www.squarecoloring.com) 把小尺寸像素格图做成可打印的图纸：A4、Letter、A5 或正方形，
黑白、无水印、无需注册、份数不限。同一张格图可生成四种图纸 —— 带数字的、空白线稿、完成图，以及十字绣图表。
