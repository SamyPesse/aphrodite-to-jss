# aphrodite-to-jss

This module is an Aphrodite compatible API on top of JSS. This module is designed to easily switch a large code base from Aphrodite to JSS.

The main difference with [`aphrodite-jss`](https://github.com/cssinjs/aphrodite-jss) is that all of the Aphrodite styles are compatible (ex: `css` supports nested arrays, etc).

When using webpack or babel, you can resolve `aphrodite` to `aphrodite-to-jss`.

# Installation

```js
$ yarn add aphrodite-to-jss
```

# Usage

```js
import React, { Component } from 'react';
import { render } from 'react-dom';
import { StyleSheet, css } from 'aphrodite-to-jss';

const styles = StyleSheet.create({
    '@global': {
        html: {
            textAlign: 'center'
        }
    },

    red: {
        backgroundColor: 'red'
    },

    blue: {
        backgroundColor: 'blue'
    },

    hover: {
        ':hover': {
            backgroundColor: 'red'
        }
    },

    small: {
        '@media (max-width: 600px)': {
            backgroundColor: 'red',
        }
    }
});

class App extends Component {
    render() {
        return <div>
            <span className={css(styles.red)}>
                This is red.
            </span>
            <span className={css(styles.hover)}>
                This turns red on hover.
            </span>
            <span className={css(styles.small)}>
                This turns red when the browser is less than 600px width.
            </span>
            <span className={css(styles.red, styles.blue)}>
                This is blue.
            </span>
            <span className={css(styles.blue, styles.small)}>
                This is blue and turns red when the browser is less than
                600px width.
            </span>
        </div>;
    }
}

render(document.body, <App />, () => {
    // Difference with aphrodite: need to be called once in the browser
    // When not using SSR: it can be called next to StyleSheet.create (before rendering)
    StyleSheet.attach();
});
```

# Compatibilities

With Aphrodite:

- ✅ **Pseudo-elements**: `{ ':hover': { color: 'red' } }`
- ✅ **Animation keyframes**: `{ animation: { from: { opacity: 0 }, to: { opacity: 1} } }`
- ✅ **SSR autoprefixing**: properties are auto-prefixed during server and browser rendering
- ❌ **Font-face**: not currently implemented, but could be (PR welcomed !)

With JSS:

- ✅ **JSS pseudo-elements**: `{ '&:hover': { color: 'red' } }`
- ✅ **JSS nested**: `{ '& .button': { color: 'red' } }`
- ✅ **JSS global styles**: `{ '@global': { html: { color: 'black' } } }`

# Server-side rendering (SSR)

The API for SSR differs with the one from Aphrodite.

There are 2 functions you need to know - `StyleSheet.toCSSString()` and `StyleSheet.reset()`. As `aphrodite-to-jss` can not know that you are rendering a new response, you need to get the CSS (`StyleSheet.toCSSString()`) when you are processing the first request and call `StyleSheet.reset()` to clean up the styles your current page has produced.

```js
import { StyleSheet } from 'aphrodite-jss'

function render() {
  const app = renderApp()
  const css = StyleSheet.toCSSString()
  StyleSheet.reset()

  return `
    <head>
      <style>
        ${css}
      </style>
    <head>
    <body>
      ${app}
    </body>
  `
}
```

# API

#### `StyleSheet.create(styles: StyleDefinitions):  { [key: string]: SheetDefinition }`

Create function doesn't render anything, it just registers your styles.  
Returns an object, where key names correspond the original styles object.

#### `StyleSheet.attach(): void`

This method should be called in the browse, it attach the `<style>` element from JSS to the DOM.

When doing SSR, it should be called after the first rendering (after removing the server rendered `<style>` element).

When not doing SSR, it can be called when importing `aphrodite-to-jss`.

#### `StyleSheet.toCSSString(): string`

For SSR, it returns the CSS string that have be injected.

#### `StyleSheet.reset(): string`

Reset the injected styles.

#### `css(...styles: SheetDefinitions): string`

Injects a previously defined rule to the dom. This is done in sync, so the CSS rule is immediately available.

Returns a class name.

# License

MIT