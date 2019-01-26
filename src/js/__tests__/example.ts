import coalesce from '../utils/coalesce';

test('it works', () => {});

test('check ENV', () => {
  expect(process.env.NODE_ENV).toBe('test');
});

test('coalesce returns the first value that is not null, undefined, NaN', () => {
  expect(coalesce(null, undefined, NaN, 'maybe')).toBe('maybe');
});
