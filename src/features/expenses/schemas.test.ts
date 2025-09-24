import { expenseWeightsForm, expenseExactForm } from './schemas';

test('weights requires at least one weight > 0', () => {
  const r = expenseWeightsForm.safeParse({
    title: 'A', amountMajor: 1, paidBy: 'u1', date: '2025-01-01',
    splitMode: 'weights', weights: { u1: 0, u2: 0 }
  });
  expect(r.success).toBe(false);
});

test('exact allows zero entries but we enforce at UI sum check', () => {
  const r = expenseExactForm.safeParse({
    title: 'A', amountMajor: 10, paidBy: 'u1', date: '2025-01-01',
    splitMode: 'exact', exactsMajor: { u1: 5, u2: 5 }
  });
  expect(r.success).toBe(true);
});
