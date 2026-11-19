# Changelog

## 0.1.2

Released from CI through npm trusted publishing, so every tarball from here on
carries a provenance statement you can verify.

- The release workflow upgrades npm before publishing: Node 22 ships npm 10, and
  trusted publishing needs 11.5.1 or later.
- A release run no longer fails when the version is already on the registry.

Nothing changed in the templates themselves; `0.1.1` and `0.1.2` hold the same
113 of them.

## 0.1.1

- Records no longer link straight to the PDF. Those are rendered on request by
  a small box behind the website, and this data is mirrored across npm, jsDelivr
  and unpkg; the sheet's own page is linked instead, which is where the PDF is
  offered anyway.
- Which sheets may be republished is decided by account id rather than account
  name.

## 0.1.0

First release: 113 colour-by-number templates as JSON and CSV, with the colour
key, the collections they belong to and the page each one has on
[SquareColoring](https://www.squarecoloring.com/printable), plus a library and a
CLI that render any of them as SVG.

Unpublished — it linked directly to the PDF host. Use 0.1.1 or later.
