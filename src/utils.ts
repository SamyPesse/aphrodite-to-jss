import stringHash = require('string-hash');

/*
 * Return a fast hash of an input object.
 */
function hash(input: any): string {
  return stringHash(JSON.stringify(input)).toString();
}

/*
 * Test if a value is a pure object.
 */
function isObject(value: any): value is object {
  return value && typeof value === 'object' && !Array.isArray(value);
}

export { hash, isObject };
