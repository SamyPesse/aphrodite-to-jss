import hyphenate = require('hyphenate-style-name');
import { prefix } from 'inline-style-prefixer';

import { StyleDefinition, StyleDefinitions } from './types';
import { hash, isObject } from './utils';

/*
 * Normalize styles in aphrodite syntax to the JSS syntax.
 */
function normalizeStyle(
  input: StyleDefinition
): { style: StyleDefinition; globals: StyleDefinitions } {
  const style: StyleDefinition = normalizePlainStyle(input);
  const globals: StyleDefinitions = {};

  Object.keys(input).forEach(key => {
    const value = input[key];

    if (
      typeof value !== 'object' ||
      (!isPseudoElementKey(key) && !isMediaQueryKey(key))
    ) {
      return;
    }

    // Normalize media-queries and pseudo-elements
    const newKey = isPseudoElementKey(key)
      ? normalizePseudoElementKey(key)
      : key;
    const result = normalizeStyle(value);

    style[newKey] = result.style;
    Object.assign(globals, result.globals);
  });

  const animation = style.animation || style['animation-name'];
  if (animation && typeof animation === 'object') {
    const keyFrames: StyleDefinition[] = Array.isArray(animation)
      ? animation
      : [animation];

    const keyFrameNames = keyFrames.map(keyFrame => {
      const animationName = `animation-${hash(keyFrame)}`;
      globals[`@keyframes ${animationName}`] = normalizeKeyFrame(keyFrame);

      return `$${animationName}`;
    });

    style[
      style.animation ? 'animation' : 'animation-name'
    ] = keyFrameNames.join(', ');
  }

  return { style, globals };
}

/*
 * Normalize multiple global styles.
 */
function normalizeStyles(
  input: StyleDefinitions
): { styles: StyleDefinition; globals: StyleDefinitions } {
  const styles: StyleDefinitions = {};
  const globals: StyleDefinitions = {};

  Object.keys(input).forEach(key => {
    const result = normalizeStyle(input[key]);

    styles[key] = result.style;
    Object.assign(globals, result.globals);
  });

  return { styles, globals };
}

/*
 * Normalize a keyframe.
 */
function normalizeKeyFrame(keyFrame: StyleDefinition): StyleDefinition {
  const result: StyleDefinition = {};

  Object.keys(keyFrame).forEach(key => {
    const value = keyFrame[key];

    if (typeof value !== 'object' || !value) {
      throw new Error('KeyFrame should only contains a map of keys to styles');
    }

    result[key] = normalizePlainStyle(value);
  });

  return result;
}

/*
 * Normalize a plain style object.
 * It removes the pseudo-elements and media-queries.
 */
function normalizePlainStyle(input: StyleDefinition): StyleDefinition {
  const result: StyleDefinition = {};
  const prefixed = prefix(input);

  Object.keys(prefixed).forEach(key => {
    const value = prefixed[key];

    if (isPseudoElementKey(key) || isMediaQueryKey(key)) {
      return;
    }

    result[hyphenate(key)] = value;
  });

  return result;
}

/*
 * Test if a key is a pseudo-element.
 */
function isPseudoElementKey(key: string): boolean {
  return key[0] === ':' || key[0] === '&';
}

/*
 * Test if a key is a media-query.
 */
function isMediaQueryKey(key: string): boolean {
  return key[0] === '@';
}

/*
 * Normalize a pseudo-element key to support both JSS and aphrodite.
 */
function normalizePseudoElementKey(key: string): string {
  return key[0] !== '&' ? `&${key}` : key;
}

export { normalizeStyle, normalizeStyles };
