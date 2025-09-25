import { expenseWeightsForm, expenseExactForm } from '@/features/expenses/schemas';

test('weights must have some positive', () => {
  const r = expenseWeightsForm.safeParse({ title:'x', amountMajor:1, paidBy:'u', date:'2025-01-01', splitMode:'weights', weights:{u:0} });
  expect(r.success).toBe(false);
});
test('exact schema accepts numbers; sum check handled at submit', () => {
  const r = expenseExactForm.safeParse({ title:'x', amountMajor:10, paidBy:'u', date:'2025-01-01', splitMode:'exact', exactsMajor:{u:10} });
  expect(r.success).toBe(true);
});
