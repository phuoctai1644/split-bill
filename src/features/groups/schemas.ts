import { z } from 'zod';

export const groupForm = z.object({
  name: z.string().trim().min(1, 'Nhập tên nhóm'),
  currency: z.enum(['VND', 'USD', 'EUR']),
});
export type GroupForm = z.infer<typeof groupForm>;

export const memberForm = z.object({
  name: z.string().trim().min(1, 'Nhập tên thành viên'),
  alias: z.string().trim().optional(),
});
export type MemberForm = z.infer<typeof memberForm>;
