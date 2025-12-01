import { z } from 'zod';
import { Currency } from '../../services/db';

export const groupForm = z.object({
  name: z.string().trim().min(1, 'Nhập tên nhóm'),
  currency: z.nativeEnum(Currency),
});
export type GroupForm = z.infer<typeof groupForm>;

const baseMemberSchema = z.object({
  name: z.string().trim(),
  alias: z.string().trim().optional(),
});

export const memberForm = baseMemberSchema.extend({
  name: z.string().trim().min(1, 'Nhập tên thành viên'),
});
export type MemberForm = z.infer<typeof memberForm>;

export const memberEditForm = baseMemberSchema.extend({
  name: z.string().trim().min(1, 'Nhập tên'),
});
export type MemberEditForm = z.infer<typeof memberEditForm>;
