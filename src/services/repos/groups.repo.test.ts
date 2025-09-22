import { db } from '@/services/db';
import { groupsRepo } from './groups.repo';

beforeEach(async () => { await db.delete(); await db.open(); });

test('create → list → update → delete group', async () => {
  const g = await groupsRepo.create({ name: 'Trip', currency: 'VND' });
  let list = await groupsRepo.list();
  expect(list.some(x => x.id === g.id)).toBeTruthy();

  await groupsRepo.update(g.id, { name: 'Trip 2' });
  const g2 = await groupsRepo.get(g.id);
  expect(g2?.name).toBe('Trip 2');

  await groupsRepo.remove(g.id);
  list = await groupsRepo.list();
  expect(list.length).toBe(0);
});
