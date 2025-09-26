import { settle, validateSettlement } from '@/utils/settlement';
test('greedy minimal pairs', () => {
  const b = { a: 70, b: 30, c: -50, d: -50 };
  const tx = settle(b);
  expect(tx.length).toBeLessThanOrEqual(3);
  expect(validateSettlement(b, tx)).toBe(true);
});
