import { groupForm, memberForm } from './schemas';

test('groupForm requires name', () => {
  const r = groupForm.safeParse({ name: '', currency: 'VND' });
  expect(r.success).toBe(false);
});

test('memberForm requires name', () => {
  const r = memberForm.safeParse({ name: '' });
  expect(r.success).toBe(false);
});
