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

it('should merge the sub-property', () => {
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

it('should merge the sub-property (camel-case)', () => {
  expect(
    mergeStyles(
      {
        marginRight: 5
      },
      {
        margin: 3
      }
    )
  ).toEqual({
    margin: 3
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
