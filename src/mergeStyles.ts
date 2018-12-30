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
    const aStyle = result[key];

    if (key === 'fallback' && Array.isArray(bStyle)) {
      result[key] = Array.isArray(aStyle)
        ? mergeFallbacks(aStyle, bStyle)
        : bStyle;
      return;
    }

    // Media-queries, pseudo-elements
    if (isObject(bStyle) && !Array.isArray(bStyle)) {
      result[key] = mergeStyles(
        isObject(aStyle) && !Array.isArray(aStyle) ? aStyle : {},
        bStyle
      );
    } else {
      result[key] = bStyle;
    }
  });

  return result;
}

/*
 * Merge two set of fallbacks, and optimize to unify the values.
 */
function mergeFallbacks(
  a: StyleDefinition[],
  b: StyleDefinition[]
): StyleDefinition[] {
  return b.concat(a).filter((value, index, self) => {
    const property = Object.keys(value)[0];

    const otherIndex = self.findIndex(otherValue => {
      const otherProperty = Object.keys(otherValue)[0];
      return otherProperty === property;
    });

    return otherIndex === index;
  });
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
