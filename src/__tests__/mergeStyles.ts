import mergeStyles from '../mergeStyles';

it('should merge the pseudo elements', () => {
  expect(
    mergeStyles(
      {
        '&:before': {
          color: 'black',
          padding: 5
        }
      },
      {
        '&:before': {
          color: 'red'
        }
      }
    )
  ).toEqual({
    '&:before': {
      color: 'red',
      padding: 5
    }
  });
});

it('should merge the shorthands', () => {
  expect(
    mergeStyles(
      {
        'margin-right': 5
      },
      {
        margin: 3
      }
    )
  ).toEqual({
    margin: 3
  });
});

it('should not merge non-shorthand', () => {
  expect(
    mergeStyles(
      {
        'border-radius': 5
      },
      {
        border: '1px solid'
      }
    )
  ).toEqual({
    'border-radius': 5,
    border: '1px solid'
  });
});

it('should merge the media query', () => {
  expect(
    mergeStyles(
      {
        '@media (print)': {
          color: 'black',
          padding: 5
        }
      },
      {
        '@media (print)': {
          color: 'red'
        }
      }
    )
  ).toEqual({
    '@media (print)': {
      color: 'red',
      padding: 5
    }
  });
});

it('should merge conflicting fallbacks', () => {
  expect(
    mergeStyles(
      {
        display: 'flex',
        fallbacks: [{ display: '-webkit-box' }]
      },
      {
        display: 'grid',
        fallbacks: [{ display: '-webkit-grid' }]
      }
    )
  ).toEqual({
    display: 'grid',
    fallbacks: [{ display: '-webkit-grid' }]
  });
});

it('should merge different fallbacks', () => {
  expect(
    mergeStyles(
      {
        display: 'flex',
        background: 'linear-gradient(to right, red 0%, green 100%)',
        fallbacks: [{ display: '-webkit-box' }, { background: 'red' }]
      },
      {
        display: 'grid',
        fallbacks: [{ display: '-webkit-grid' }]
      }
    )
  ).toEqual({
    display: 'grid',
    background: 'linear-gradient(to right, red 0%, green 100%)',
    fallbacks: [{ display: '-webkit-grid' }, { background: 'red' }]
  });
});
