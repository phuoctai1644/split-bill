import { computeBalances, owedPerExpense } from './balance';
import type { Expense } from '@/services/db';

const mk = (p: Partial<Expense>): Expense => ({
  id: 'e',
  groupId: 'g',
  title: 't',
  amount: 0,
  currency: 'VND',
  paidBy: 'u1',
  date: '2025-01-01',
  splitMode: 'equal',
  ...p,
});

test('owedPerExpense equal', () => {
  const e = mk({ amount: 100, splitMode: 'equal' });
  const owed = owedPerExpense(e, ['u1','u2','u3']);
  expect(Object.values(owed).reduce((a,b)=>a+b,0)).toBe(100);
});

test('owedPerExpense weights', () => {
  const e = mk({ amount: 100, splitMode: 'weights', weights: { u1: 1, u2: 1, u3: 2 } });
  const owed = owedPerExpense(e, ['u1','u2','u3']);
  expect(Object.values(owed).reduce((a,b)=>a+b,0)).toBe(100);
  expect(owed.u3).toBeGreaterThanOrEqual(owed.u1);
});

test('owedPerExpense exact', () => {
  const e = mk({ amount: 90, splitMode: 'exact', exacts: { u1: 30, u2: 30, u3: 30 } });
  const owed = owedPerExpense(e, ['u1','u2','u3']);
  expect(owed.u1).toBe(30);
  expect(Object.values(owed).reduce((a,b)=>a+b,0)).toBe(90);
});

test('computeBalances aggregates paid minus owed', () => {
  const expenses: Expense[] = [
    mk({ id: 'e1', amount: 90, paidBy: 'u1', splitMode: 'equal' }),
    mk({ id: 'e2', amount: 60, paidBy: 'u2', splitMode: 'weights', weights: { u1:1, u2:1, u3:2 } }),
    mk({ id: 'e3', amount: 30, paidBy: 'u3', splitMode: 'exact', exacts: { u1:10,u2:10,u3:10 } }),
  ];
  const bal = computeBalances(expenses, ['u1','u2','u3']);
  // Tổng balance phải = 0
  expect(Object.values(bal).reduce((a,b)=>a+b,0)).toBe(0);
});
