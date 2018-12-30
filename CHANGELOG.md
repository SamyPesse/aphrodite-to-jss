# Changelog

## 1.1.1

- Fix weird error of fallbacks for prefix only added once
- Fix merging of fallbacks (ex: mergin style `display: flex` and `display: grid`)

## 1.1.0

- Fix output of prefixed property with fallback (ex: `display: flex`)
- Add support for aphrodite fallbacks: `background: ['red', 'linear-gradient(to right, red 0%, green 100%)']`

## 1.0.1

- Fix normalization (auto-prefixing, etc) in global styles (defined with `@global`)
- Fix use of animation keyframes in global styles

## 1.0.0

- First release