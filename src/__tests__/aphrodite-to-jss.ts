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
    expect(className).toEqual('button-f55bd29c');
  });

  it('should ignore falsy value', () => {
    const className = css(styles.button, false, null, undefined);
    expect(className).toEqual('button-f55bd29c');
  });

  it('should combine styles as arguments', () => {
    const className = css(styles.button, styles.buttonGreen);
    expect(className).toEqual('button-f55bd29c--buttonGreen-96d03856');
  });

  it('should combine styles as array', () => {
    const className = css([styles.button, styles.buttonGreen]);
    expect(className).toEqual('button-f55bd29c--buttonGreen-96d03856');
  });

  it('should combine styles as nested array', () => {
    const className = css([[styles.button], [styles.buttonGreen]]);
    expect(className).toEqual('button-f55bd29c--buttonGreen-96d03856');
  });
});

describe('StyleSheet.toCSSString()', () => {
  it('should return the CSS injected', () => {
    // Inject a style
    css(styles.button);

    const cssText = StyleSheet.toCSSString();
    expect(cssText).toEqual(`

.button-f55bd29c {
  color: red;
}`);
  });

  it('should return only the classes used', () => {
    // Inject a style
    css(styles.button, styles.buttonGreen);

    const cssText = StyleSheet.toCSSString();
    expect(cssText).toEqual(`

.button-f55bd29c--buttonGreen-96d03856 {
  color: red;
}
.button-f55bd29c--buttonGreen-96d03856:hover {
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

.button-f55bd29c {
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

  it('should return all the fallbacks', () => {
    const fallbacksStyles = StyleSheet.create({
      a: {
        overflow: 'overlay',
        fallbacks: [{ overflow: 'auto' }]
      },
      b: {
        overflowY: 'overlay',
        fallbacks: [{ overflowY: 'auto' }]
      }
    });

    css(fallbacksStyles.a, fallbacksStyles.b);

    const cssText = StyleSheet.toCSSString();
    expect(cssText).toEqual(`

.a-4ae8808c--b-436018aa {
  overflowY: auto;
  overflow: auto;
  overflow: overlay;
  overflow-y: overlay;
}`);
  });

  it('should return all the fallbacks (also prefixed ones)', () => {
    const fallbacksStyles = StyleSheet.create({
      a: {
        overflow: 'overlay',
        display: 'flex',
        fallbacks: [{ overflow: 'auto' }]
      },
      b: {
        overflowY: 'overlay',
        fallbacks: [{ overflowY: 'auto' }]
      }
    });

    css(fallbacksStyles.a, fallbacksStyles.b);

    const cssText = StyleSheet.toCSSString();
    expect(cssText).toEqual(`

.a-08216426--b-436018aa {
  overflowY: auto;
  display: -webkit-box;
  overflow: auto;
  display: flex;
  overflow: overlay;
  overflow-y: overlay;
}`);
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
    expect(cssText).toEqual(`@keyframes keyframes-animation-398cee40-0-1-1 {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
html {
  animation: keyframes-animation-398cee40-0-1-1;
}

`);
  });
});
