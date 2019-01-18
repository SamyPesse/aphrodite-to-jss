import hashSum = require('hash-sum');

/*
 * Return a fast hash of an input object.
 */
function hash(input: any): string {
  return hashSum(input)
}

/*
 * Test if a value is a pure object.
 */
function isObject(value: any): value is object {
  return value && typeof value === 'object' && !Array.isArray(value);
}

export { hash, isObject };
