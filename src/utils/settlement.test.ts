import { settle, validateSettlement } from './settlement';

test('settle pairs largest creditor with largest debtor until done', () => {
  const balances = { a: 50, b: -20, c: -30 }; // minor
  const txns = settle(balances);
  // expected minimal transactions: b->a:20, c->a:30 (2 txns)
  expect(txns).toHaveLength(2);
  expect(validateSettlement(balances, txns)).toBe(true);
});

test('no transactions when everyone is balanced', () => {
  expect(settle({ a: 0, b: 0 })).toEqual([]);
});

test('works with multiple creditors/debtors', () => {
  const b = { a: 70, b: 30, c: -50, d: -50 };
  const txns = settle(b);
  // minimal count should be <= max(nCred, nDebt) = 2
  expect(txns.length).toBeLessThanOrEqual(2);
  expect(validateSettlement(b, txns)).toBe(true);
});
