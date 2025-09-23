import { z } from 'zod';
export const expenseEqualForm = z.object({
  title: z.string().trim().min(1, 'Nhập tiêu đề'),
  amountMajor: z.number().positive('Số tiền > 0'),
  paidBy: z.string().min(1, 'Chọn người trả'),
  date: z.string().min(1, 'Chọn ngày'), // ISO yyyy-mm-dd
  note: z.string().trim().optional(),
});
export type ExpenseEqualForm = z.infer<typeof expenseEqualForm>;
