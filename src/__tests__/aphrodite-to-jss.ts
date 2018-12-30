import { css, StyleSheet } from '../';

const styles = StyleSheet.create({
  button: {
    color: 'red'
  },
  buttonGreen: {
    ':hover': {
      color: 'green'
    }
  }
});

afterEach(() => {
  StyleSheet.reset();
});

describe('css()', () => {
  it('should return a className', () => {
    const className = css(styles.button);
    expect(className).toEqual('button-2371347447');
  });

  it('should ignore falsy value', () => {
    const className = css(styles.button, false, null, undefined);
    expect(className).toEqual('button-2371347447');
  });

  it('should combine styles as arguments', () => {
    const className = css(styles.button, styles.buttonGreen);
    expect(className).toEqual('button-2371347447--buttonGreen-2088673977');
  });

  it('should combine styles as array', () => {
    const className = css([styles.button, styles.buttonGreen]);
    expect(className).toEqual('button-2371347447--buttonGreen-2088673977');
  });

  it('should combine styles as nested array', () => {
    const className = css([[styles.button], [styles.buttonGreen]]);
    expect(className).toEqual('button-2371347447--buttonGreen-2088673977');
  });
});

describe('StyleSheet.toCSSString()', () => {
  it('should return the CSS injected', () => {
    // Inject a style
    css(styles.button);

    const cssText = StyleSheet.toCSSString();
    expect(cssText).toEqual(`

.button-2371347447 {
  color: red;
}`);
  });

  it('should return only the classes used', () => {
    // Inject a style
    css(styles.button, styles.buttonGreen);

    const cssText = StyleSheet.toCSSString();
    expect(cssText).toEqual(`

.button-2371347447--buttonGreen-2088673977 {
  color: red;
}
.button-2371347447--buttonGreen-2088673977:hover {
  color: green;
}`);
  });

  it('should return global styles combined with used styles', () => {
    StyleSheet.create({
      '@global': {
        html: {
          color: 'red'
        }
      }
    });

    css(styles.button);

    const cssText = StyleSheet.toCSSString();
    expect(cssText).toEqual(`html {
  color: red;
}

.button-2371347447 {
  color: red;
}`);
  });
});
