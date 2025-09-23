import { db, type Expense } from '@/services/db';

export const expensesRepo = {
  listByGroup(groupId: string): Promise<Expense[]> {
    return db.expenses.where('groupId').equals(groupId).reverse().sortBy('date');
  },
  async create(input: Omit<Expense, 'id'>): Promise<Expense> {
    const e: Expense = { id: crypto.randomUUID(), ...input };
    await db.expenses.add(e);
    return e;
  },
  update(id: string, patch: Partial<Expense>) { return db.expenses.update(id, patch); },
  remove(id: string) { return db.expenses.delete(id); },
};
