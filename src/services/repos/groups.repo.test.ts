import { db } from '../db';
import { groupsRepo } from './groups.repo';

beforeEach(async () => { await db.delete(); await db.open(); });
test('group create/update/delete', async () => {
  const g = await groupsRepo.create({ name: 'Trip', currency: 'VND' });
  await groupsRepo.update(g.id, { name:'Trip 2' });
  expect((await groupsRepo.get(g.id))?.name).toBe('Trip 2');
  await groupsRepo.remove(g.id);
  expect((await groupsRepo.list()).length).toBe(0);
});
