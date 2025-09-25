import { equalSplit, weightsSplit, sumEquals } from '@/utils/split';

describe('split utilities', () => {
  test('equalSplit sums exactly', () => {
    const result = equalSplit(101, 4);
    expect(result.reduce((a, b) => a + b, 0)).toBe(101);
  });

  test('weightsSplit basic', () => {
    const result = weightsSplit(100, [1, 1, 2]);
    expect(result.reduce((a, b) => a + b, 0)).toBe(100);
  });

  test('sumEquals', () => {
    expect(sumEquals(100, [40, 60])).toBe(true);
  });
});
