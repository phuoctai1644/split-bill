import { db } from '../db';
import { expensesRepo } from './expenses.repo';

beforeEach(async () => { await db.delete(); await db.open(); });
test('listByGroup filters correctly', async () => {
  await expensesRepo.create({ groupId: 'g1', title: 'A', amount: 100, currency: 'VND', paidBy: 'u1', date: '2025-01-01', splitMode: 'equal' });
  await expensesRepo.create({ groupId: 'g2', title: 'B', amount: 200, currency: 'VND', paidBy: 'u1', date: '2025-01-02', splitMode: 'equal' });
  expect((await expensesRepo.listByGroup('g1')).length).toBe(1);
});
