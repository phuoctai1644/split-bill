import { db, type Group } from '@/services/db';

export const groupsRepo = {
  async list(): Promise<Group[]> {
    return db.groups.orderBy('createdAt').reverse().toArray();
  },
  async get(id: string): Promise<Group | undefined> {
    return db.groups.get(id);
  },
  async create(input: Pick<Group, 'name' | 'currency'>): Promise<Group> {
    const g: Group = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      currency: input.currency,
      createdAt: new Date().toISOString(),
    };
    await db.groups.add(g);
    return g;
  },
  async update(id: string, patch: Partial<Pick<Group, 'name' | 'currency'>>): Promise<Group> {
    await db.groups.update(id, patch);
    const updated = await db.groups.get(id);
    if (!updated) throw new Error('Group not found after update');
    return updated;
  },
  async remove(id: string) {
    // cascade: remove members & expenses belonging to the group
    await db.transaction('rw', db.members, db.expenses, db.groups, async () => {
      await db.members.where('groupId').equals(id).delete();
      await db.expenses.where('groupId').equals(id).delete();
      await db.groups.delete(id);
    });
  },
};
