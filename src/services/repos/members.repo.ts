import { db, type Member } from '@/services/db';

export const membersRepo = {
  listByGroup(groupId: string): Promise<Member[]> {
    return db.members.where('groupId').equals(groupId).sortBy('name');
  },
  async create(input: Omit<Member, 'id'>): Promise<Member> {
    const m: Member = { id: crypto.randomUUID(), ...input, name: input.name.trim() };
    await db.members.add(m);
    return m;
  },
  update(id: string, patch: Partial<Pick<Member, 'name'|'alias'>>) {
    return db.members.update(id, {
      ...patch,
      ...(patch.name ? { name: patch.name.trim() } : {}),
      ...(patch.alias ? { alias: patch.alias.trim() } : {}),
    });
  },
  remove(id: string) {
    return db.members.delete(id);
  },
};
