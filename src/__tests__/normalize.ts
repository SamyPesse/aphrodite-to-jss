import { normalizeStyle, normalizeStyles } from '../normalize';

describe('Prefixing', () => {
  it('should uncamelcase propetties', () => {
    expect(
      normalizeStyle({
        marginRight: 4
      })
    ).toEqual({
      globals: {},
      style: { 'margin-right': 4 }
    });
  });

  it('should handle prefixed fallback', () => {
    expect(
      normalizeStyle({
        display: 'flex'
      })
    ).toEqual({
      globals: {},
      style: {
        display: 'flex',
        fallbacks: [
          { display: '-webkit-box' },
          { display: '-moz-box' },
          { display: '-ms-flexbox' },
          { display: '-webkit-flex' }
        ]
      }
    });
  });

  it('should prefix properties', () => {
    expect(
      normalizeStyle({
        alignItems: 'center'
      })
    ).toEqual({
      globals: {},
      style: { '-webkit-box-align': 'center', 'align-items': 'center' }
    });
  });

  it('should prefix in pseudo-elements', () => {
    expect(
      normalizeStyle({
        ':hover': {
          alignItems: 'center'
        }
      })
    ).toEqual({
      globals: {},
      style: {
        '&:hover': { '-webkit-box-align': 'center', 'align-items': 'center' }
      }
    });
  });

  it('should prefix in animations', () => {
    expect(
      normalizeStyle({
        animationName: {
          from: {
            alignItems: 'center'
          },
          to: {
            alignItems: 'left'
          }
        }
      })
    ).toEqual({
      globals: {
        '@keyframes animation-4901b894': {
          from: { '-webkit-box-align': 'center', 'align-items': 'center' },
          to: { '-webkit-box-align': 'left', 'align-items': 'left' }
        }
      },
      style: { 'animation-name': '$animation-4901b894' }
    });
  });
});

describe('Pseudo-elements', () => {
  it('should normalize pseudo elements', () => {
    expect(
      normalizeStyle({
        ':before': {
          color: 'black',
          padding: 5
        }
      })
    ).toEqual({
      globals: {},
      style: {
        '&:before': {
          color: 'black',
          padding: 5
        }
      }
    });
  });

  it('should support the JSS syntax', () => {
    expect(
      normalizeStyle({
        '&:before': {
          color: 'black',
          padding: 5
        }
      })
    ).toEqual({
      globals: {},
      style: {
        '&:before': {
          color: 'black',
          padding: 5
        }
      }
    });
  });
});

describe('Animations', () => {
  it('should normalize animations', () => {
    expect(
      normalizeStyle({
        animationName: {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        }
      })
    ).toEqual({
      globals: {
        '@keyframes animation-398cee40': {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        }
      },
      style: {
        'animation-name': '$animation-398cee40'
      }
    });
  });

  it('should normalize animations as array', () => {
    expect(
      normalizeStyle({
        animationName: [
          {
            from: {
              opacity: 0
            },
            to: {
              opacity: 1
            }
          },
          {
            from: {
              color: 'red'
            },
            to: {
              opacity: 'blue'
            }
          }
        ]
      })
    ).toEqual({
      globals: {
        '@keyframes animation-0ff05eb8': {
          from: { color: 'red' },
          to: { opacity: 'blue' }
        },
        '@keyframes animation-398cee40': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      },
      style: {
        'animation-name': '$animation-398cee40, $animation-0ff05eb8'
      }
    });
  });
});

describe('normalizeStyles', () => {
  it('should return all of the style normalized', () => {
    expect(
      normalizeStyles({
        html: {
          display: 'flex',
          alignItems: 'center'
        }
      })
    ).toEqual({
      globals: {},
      styles: {
        html: {
          '-webkit-box-align': 'center',
          'align-items': 'center',
          display: 'flex',
          fallbacks: [
            { display: '-webkit-box' },
            { display: '-moz-box' },
            { display: '-ms-flexbox' },
            { display: '-webkit-flex' }
          ]
        }
      }
    });
  });

  it('should normalize animation', () => {
    expect(
      normalizeStyles({
        html: {
          animation: {
            from: { opacity: 0 },
            to: { opacity: 1 }
          }
        }
      })
    ).toEqual({
      styles: {
        html: {
          animation: '$animation-398cee40'
        }
      },
      globals: {
        '@keyframes animation-398cee40': {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        }
      }
    });
  });
});
