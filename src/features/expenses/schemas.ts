import { z } from 'zod';

const base = {
  title: z.string().trim().min(1, 'Nhập tiêu đề'),
  amountMajor: z.number().positive('Số tiền > 0'),
  paidBy: z.string().min(1, 'Chọn người trả'),
  date: z.string().min(1, 'Chọn ngày'),
  note: z.string().trim().optional(),
};

export const expenseEqualForm = z.object({ ...base, splitMode: z.literal('equal') });

export const expenseWeightsForm = z.object({
  ...base,
  splitMode: z.literal('weights'),
  // weights: memberId -> number
  weights: z.record(z.string(), z.number().min(0)).refine(
    (w) => Object.values(w).some((x) => x > 0),
    'Tổng trọng số phải > 0'
  ),
});

export const expenseExactForm = z.object({
  ...base,
  splitMode: z.literal('exact'),
  // exacts: memberId -> major (người dùng nhập theo đơn vị hiển thị)
  exactsMajor: z.record(z.string(), z.number().min(0, 'Không âm')),
});

export const expenseAnyForm = z.discriminatedUnion('splitMode', [
  expenseEqualForm, expenseWeightsForm, expenseExactForm,
]);
export type ExpenseAnyForm = z.infer<typeof expenseAnyForm>;
