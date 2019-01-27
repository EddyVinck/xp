import coalesce from '../utils/coalesce';

test('coalesce returns the first value that is not null, undefined, NaN', () => {
  expect(coalesce(null, undefined, NaN, 'maybe')).toBe('maybe');
});

test('coalesce returns null if there is no useful value', () => {
  expect(coalesce(null, undefined, NaN)).toBe(null);
});
