import { z } from 'zod';
import { Currency } from '../../services/db';

export const groupForm = z.object({
  name: z.string().trim().min(1, 'Nhập tên nhóm'),
  currency: z.nativeEnum(Currency),
});
export type GroupForm = z.infer<typeof groupForm>;

export const memberForm = z.object({
  name: z.string().trim().min(1, 'Nhập tên thành viên'),
  alias: z.string().trim().optional(),
});
export type MemberForm = z.infer<typeof memberForm>;

export const memberEditForm = z.object({
  name: z.string().trim().min(1, 'Nhập tên'),
  alias: z.string().trim().optional(),
});
export type MemberEditForm = z.infer<typeof memberEditForm>;
