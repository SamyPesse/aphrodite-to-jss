import { create, StyleSheet } from 'jss';
import pluginDefaultUnit from 'jss-plugin-default-unit';
import pluginGlobal from 'jss-plugin-global';
import pluginNested from 'jss-plugin-nested';
import pluginPropsSort from 'jss-plugin-props-sort';

import { SheetDefinition, StyleDefinitions } from './types';

import normalizeStyle from './normalizeStyle';
import { hash } from './utils';

const jss = create({
  plugins: [
    pluginGlobal(),
    pluginNested(),
    pluginDefaultUnit({}),
    pluginPropsSort()
  ]
});

const StyleSheet = {
  toCSSString,
  create: createStyleSheet,
  reset: resetStyleSheet,
  attach: attachStyleSheet,
  sheet: createSheet(),
  globalSheet: createSheet()
};

function createStyleSheet(
  input: StyleDefinitions
): { [key: string]: SheetDefinition } {
  return Object.keys(input).reduce(
    (map: { [key: string]: SheetDefinition }, name: string) => {
      const { style, extras } = normalizeStyle(input[name]);

      if (name === '@global') {
        StyleSheet.globalSheet.addRule(name, style);

        Object.keys(extras).forEach(extraKey => {
          StyleSheet.globalSheet.addRule(extraKey, extras[extraKey]);
        });
      }

      const className = generateClassName(name, style);

      map[name] = {
        className,
        extras,
        style
      };
      return map;
    },
    {}
  );
}

function generateClassName(name: string, style: any): string {
  return `${name}-${hash(style)}`;
}

/*
 * Create the JSS stylesheet.
 */
function createSheet(): StyleSheet {
  return jss.createStyleSheet(
    {},
    {
      meta: 'aphrodite-to-jss'
    }
  );
}

/*
 * For SSR: Return all of the CSS generated since the last "resetStyles".
 */
function toCSSString() {
  return [StyleSheet.globalSheet.toString(), StyleSheet.sheet.toString()].join(
    '\n\n'
  );
}

/*
 * For Browser: Attach the stylesheet to the DOM.
 */
function attachStyleSheet() {
  StyleSheet.globalSheet.attach();
  StyleSheet.sheet.attach();
}

/*
 * For SSR: Reset everything.
 */
function resetStyleSheet() {
  jss.removeStyleSheet(StyleSheet.sheet);
  StyleSheet.sheet = createSheet();
}

export default StyleSheet;
