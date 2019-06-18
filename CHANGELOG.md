# Changelog

# Changelog

## 1.1.7

- Update JSS dependencies

## 1.1.6

- Improve performance of `css` calls

## 1.1.5

- Normalize properties in `fallbacks` (for example `overflowY` to `overflow-y`)

## 1.1.4

- Fix `fallbacks` being lost and not correctly merged

## 1.1.3

- Fix classNames not being deterministic 

## 1.1.2

- Fix false-positive with merge of shorthand properties (ex: `border-radius` and `border`)

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