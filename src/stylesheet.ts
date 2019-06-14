import { create, StyleSheet as JSSStyleSheet } from 'jss';
import pluginDefaultUnit from 'jss-plugin-default-unit';
import pluginGlobal from 'jss-plugin-global';
import pluginNested from 'jss-plugin-nested';
import pluginPropsSort from 'jss-plugin-props-sort';

import { SheetDefinition, StyleDefinitions } from './types';

import { normalizeStyle, normalizeStyles } from './normalize';
import { hash, isObject } from './utils';

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
      if (name === '@global') {
        // @ts-ignore
        const globalStyle: StyleDefinitions = input[name];

        if (!isObject(globalStyle)) {
          throw new Error('"@global" should be an object');
        }

        createGlobalStyleSheet(globalStyle);

        return map;
      }

      const { style, globals } = normalizeStyle(input[name]);
      const className = generateClassName(name, style);

      map[name] = {
        className,
        globals,
        style
      };
      return map;
    },
    {}
  );
}

/*
 * Create and inject some global styles.
 */
function createGlobalStyleSheet(input: StyleDefinitions) {
  const { styles, globals } = normalizeStyles(input);

  Object.keys(globals).forEach(key => {
    StyleSheet.globalSheet.addRule(key, globals[key]);
  });

  StyleSheet.globalSheet.addRule('@global', styles);
}

/*
 * Generate a local class name.
 */
function generateClassName(name: string, style: any): string {
  return `${name}-${hash(style)}`;
}

/*
 * Create the JSS stylesheet.
 */
function createSheet(): JSSStyleSheet {
  return jss.createStyleSheet(
    {},
    {
      meta: 'aphrodite-to-jss'
    }
  ) as JSSStyleSheet;
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
function resetStyleSheet(globals: boolean = false) {
  jss.removeStyleSheet(StyleSheet.sheet);
  StyleSheet.sheet = createSheet();

  if (globals) {
    jss.removeStyleSheet(StyleSheet.globalSheet);
    StyleSheet.globalSheet = createSheet();
  }
}

export default StyleSheet;
