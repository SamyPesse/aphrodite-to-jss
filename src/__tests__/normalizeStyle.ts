import normalizeStyle from '../normalizeStyle';

describe('Prefixing', () => {
  it('should uncamelcase propetties', () => {
    expect(
      normalizeStyle({
        marginRight: 4
      })
    ).toEqual({
      extras: {},
      style: { 'margin-right': 4 }
    });
  });

  it('should prefix properties', () => {
    expect(
      normalizeStyle({
        alignItems: 'center'
      })
    ).toEqual({
      extras: {},
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
      extras: {},
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
      extras: {
        '@keyframes animation-717956034': {
          from: { '-webkit-box-align': 'center', 'align-items': 'center' },
          to: { '-webkit-box-align': 'left', 'align-items': 'left' }
        }
      },
      style: { 'animation-name': '$animation-717956034' }
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
      extras: {},
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
      extras: {},
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
      extras: {
        '@keyframes animation-1936999747': {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        }
      },
      style: {
        'animation-name': '$animation-1936999747'
      }
    });
  });
});
