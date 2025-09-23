import { equalSplit } from './split';

test('equalSplit distributes all minor units with largest remainder', () => {
  expect(equalSplit(100, 3)).toEqual([34,33,33]); // order may vary by tie-break; this one is fine
  expect(equalSplit(5, 2)).toEqual([3,2]);
  expect(equalSplit(0, 3)).toEqual([0,0,0]);
});
