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
  return rules.reduce(
    (
      result: SheetDefinition[],
      rule: SheetDefinition | SheetDefinitions | null | undefined | false
    ) => {
      if (!rule) {
        return result;
      }

      if (rule instanceof Array) {
        return result.concat(flattenRules(rule));
      }

      return result.concat([rule]);
    },
    []
  );
}

export default css;
