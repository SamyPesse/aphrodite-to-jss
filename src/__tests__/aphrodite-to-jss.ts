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
  // Also reset the globals for testing
  StyleSheet.reset(true);
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

  it('should return normalized global style', () => {
    StyleSheet.create({
      '@global': {
        html: {
          display: 'flex',
          boxSizing: 'border-box',
          alignItems: 'center'
        }
      }
    });

    const cssText = StyleSheet.toCSSString();
    expect(cssText).toEqual(`html {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  -webkit-box-align: center;
}

`);
  });

  it('should support animations in global', () => {
    StyleSheet.create({
      '@global': {
        html: {
          animation: {
            from: { opacity: 0 },
            to: { opacity: 1 }
          }
        }
      }
    });

    const cssText = StyleSheet.toCSSString();
    expect(cssText).toEqual(`@keyframes keyframes-animation-1936999747-0-1-1 {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
html {
  animation: keyframes-animation-1936999747-0-1-1;
}

`);
  });
});
