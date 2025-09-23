import { db } from '@/services/db';
import { expensesRepo } from './expenses.repo';

beforeEach(async () => { await db.delete(); await db.open(); });

test('create and list expenses by group', async () => {
  const g1 = 'g1', g2 = 'g2';
  await expensesRepo.create({ groupId: g1, title: 'A', amount: 1000, currency: 'VND', paidBy: 'u1', date: '2025-01-01', splitMode: 'equal' });
  await expensesRepo.create({ groupId: g2, title: 'B', amount: 2000, currency: 'VND', paidBy: 'u1', date: '2025-01-02', splitMode: 'equal' });

  const list1 = await expensesRepo.listByGroup(g1);
  expect(list1).toHaveLength(1);
  expect(list1[0].title).toBe('A');
});
