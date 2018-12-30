import { StyleDefinition } from './types';
import { isObject } from './utils';

/*
 * Merge two set of styles together (already normalized).
 */
function mergeStyles(a: StyleDefinition, b: StyleDefinition): StyleDefinition {
  const result = { ...a };

  // When merging "margin: 0px" with "margin-right: 0px", the second should be removed
  Object.keys(b).forEach(key => {
    Object.keys(result).forEach(aKey => {
      if (isSubProperty(aKey, key)) {
        delete result[aKey];
      }
    });
  });

  Object.keys(b).forEach(key => {
    const bStyle = b[key];

    // Media-queries, pseudo-elements
    if (isObject(bStyle)) {
      const aStyle = result[key];
      result[key] = mergeStyles(isObject(aStyle) ? aStyle : {}, bStyle);
    } else {
      result[key] = bStyle;
    }
  });

  return result;
}

/*
 * Test if a property is a sub-property of another.
 * ex: isSubProperty('margin-right', 'margin') === true
 */
function isSubProperty(subProperty: string, property: string): boolean {
  if (subProperty.indexOf(`${property}-`) === 0) {
    return true;
  }

  if (subProperty.indexOf(property) !== 0) {
    return false;
  }

  // Handle the camel case
  const charAfter = subProperty[property.length];
  return Boolean(charAfter && charAfter === charAfter.toUpperCase());
}

export default mergeStyles;
