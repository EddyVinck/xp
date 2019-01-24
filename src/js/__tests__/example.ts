import coalesce from '../utils/coalesce';

test('it works', () => {});

test('check ENV', () => {
  expect(process.env.NODE_ENV).toBe('test');
});

test('coalesce works', () => {
  expect(coalesce(null, undefined, 'maybe')).toBe('maybe');
});
