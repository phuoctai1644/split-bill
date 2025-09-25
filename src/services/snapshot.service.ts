import { db } from '@/services/db';
import type { Snapshot } from '@/utils/snapshot';

export async function buildGroupSnapshot(groupId: string): Promise<Snapshot> {
  const group = await db.groups.get(groupId);
  if (!group) throw new Error('Group not found');
  const [members, expenses] = await Promise.all([
    db.members.where('groupId').equals(groupId).toArray(),
    db.expenses.where('groupId').equals(groupId).toArray(),
  ]);
  return { schemaVersion: 1, group, members, expenses };
}
