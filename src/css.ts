import mergeStyles from './mergeStyles';
import StyleSheet from './stylesheet';
import { SheetDefinition, SheetDefinitions } from './types';

/*
 * Compute a className from a set of sheet definitions.
 */
function css(...args: SheetDefinitions): string {
  const rules = flattenRules(args);
  const className = rules.map(rule => rule.className).join('--');

  if (StyleSheet.sheet.getRule(className)) {
    return className;
  }

  const style = rules.reduce(
    (result, rule) => mergeStyles(result, rule.style),
    {}
  );

  rules.forEach(rule => {
    Object.keys(rule.globals).forEach(extraKey => {
      StyleSheet.sheet.addRule(extraKey, rule.globals[extraKey]);
    });
  });

  // @ts-ignore RuleOptions can be only { selector: string }
  StyleSheet.sheet.addRule(className, style, { selector: `.${className}` });

  return className;
}

/*
 * Flatten a nested SheetDefinitions into a list of SheetDefinition.
 */
function flattenRules(rules: SheetDefinitions): SheetDefinition[] {
  const result: SheetDefinition[] = [];
  _flattenRules(rules, result);
  return result;
}

/*
 * _flattenRules adds all the valid rules into the provided accumulator
 * in an optimized fashion (avoiding unecessary allocations)
 */
function _flattenRules(rules: SheetDefinitions, accu: SheetDefinition[]) {
  for (const idx in rules) {
    const rule = rules[idx];
    if (!rule) {
      continue;
    } else if (rule instanceof Array) {
      _flattenRules(rule, accu);
    } else {
      accu.push(rule);
    }
  }
}

export default css;
