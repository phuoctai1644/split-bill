import { computeBalances, owedPerExpense } from '@/utils/balance';
import type { Expense } from '@/services/db';

const e = (p: Partial<Expense>) => ({ id: 'e', groupId: 'g', currency: 'VND', title: 't', paidBy: 'u1', date: '2025-01-01', amount: 0, splitMode: 'equal', ...p } as Expense);

test('owedPerExpense modes sum to total', () => {
  const ids = ['u1', 'u2', 'u3'];
  expect(Object.values(owedPerExpense(e({ amount: 90, splitMode: 'equal' }), ids)).reduce((a: number, b: number) => a + b, 0)).toBe(90);
  expect(Object.values(owedPerExpense(e({ amount: 90, splitMode: 'weights', weights: { u1: 1, u2: 1, u3: 2 } }), ids)).reduce((a: number, b: number) => a + b, 0)).toBe(90);
  expect(Object.values(owedPerExpense(e({ amount: 90, splitMode: 'exact', exacts: { u1: 30, u2: 30, u3: 30 } }), ids)).reduce((a: number, b: number) => a + b, 0)).toBe(90);
});

test('computeBalances total zero', () => {
  const ids = ['u1', 'u2', 'u3'];
  const expenses = [
    e({ id: 'a', amount: 90, splitMode: 'equal', paidBy: 'u1' }),
    e({ id: 'b', amount: 60, splitMode: 'weights', paidBy: 'u2', weights: { u1: 1, u2: 1, u3: 2 } }),
    e({ id: 'c', amount: 30, splitMode: 'exact', paidBy: 'u3', exacts: { u1: 10, u2: 10, u3: 10 } }),
  ];
  const bal = computeBalances(expenses, ids);
  expect(Object.values(bal).reduce((a: number, b: number) => a + b, 0)).toBe(0);
});
