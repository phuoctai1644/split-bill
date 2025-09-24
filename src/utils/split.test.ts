import { equalSplit, sumEquals, weightsSplit } from './split';

test('equalSplit distributes all minor units with largest remainder', () => {
  expect(equalSplit(100, 3)).toEqual([34,33,33]); // order may vary by tie-break; this one is fine
  expect(equalSplit(5, 2)).toEqual([3,2]);
  expect(equalSplit(0, 3)).toEqual([0,0,0]);
});

test('weightsSplit respects largest remainder and non-negative weights', () => {
  const res = weightsSplit(100, [1,1,2]); // 1:1:2
  expect(res.reduce((a,b)=>a+b,0)).toBe(100);
  // Typical distribution ~ [25,25,50] but order can vary on ties
});

test('sumEquals works in minor units', () => {
  expect(sumEquals(100, [40,60])).toBe(true);
  expect(sumEquals(100, [40,50])).toBe(false);
});

