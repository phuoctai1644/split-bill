import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseEqualForm, type ExpenseEqualForm } from './schemas';
import { toMinor, formatMoney } from '@/utils/money';
import { equalSplit } from '@/utils/split';
import { Currency } from '@/services/db';

export function AddExpenseEqualModal({
  currency, members, onClose, onSave,
}: {
  currency: Currency;
  members: { id: string; name: string }[];
  onClose: () => void;
  onSave: (payload: {
    title: string; amount: number; currency: Currency; paidBy: string; date: string;
    note?: string; splitMode: 'equal';
  }) => void;
}) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } =
    useForm<ExpenseEqualForm>({
      resolver: zodResolver(expenseEqualForm),
      defaultValues: { amountMajor: 0, date: new Date().toISOString().slice(0, 10) },
    });

  const amountMinor = toMinor(Number(watch('amountMajor') || 0), currency);
  const shares = useMemo(
    () => amountMinor > 0 ? equalSplit(amountMinor, members.length) : members.map(() => 0),
    [amountMinor, members.length]
  );

  return (
    <div className="fixed inset-0 z-30 bg-black/50 flex items-end">
      <form
        onSubmit={handleSubmit((v) => onSave({
          title: v.title.trim(),
          amount: toMinor(v.amountMajor, currency),
          currency,
          paidBy: v.paidBy,
          date: v.date,
          note: v.note?.trim() || undefined,
          splitMode: 'equal',
        }))}
        className="w-full max-w-[480px] mx-auto bg-white rounded-t-3xl p-4"
      >
        <div className="font-semibold mb-3">Thêm chi tiêu (Chia đều)</div>

        <label className="text-sm text-gray-600">Tiêu đề</label>
        <input className="w-full mt-1 px-3 py-2 rounded-xl border" {...register('title')} />
        {errors.title && <div className="text-xs text-rose-600 mt-1">{errors.title.message}</div>}

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-sm text-gray-600">Số tiền ({currency})</label>
            <input type="number" step="any" className="w-full mt-1 px-3 py-2 rounded-xl border" {...register('amountMajor', { valueAsNumber: true })} />
            {errors.amountMajor && <div className="text-xs text-rose-600 mt-1">{errors.amountMajor.message}</div>}
          </div>
          <div>
            <label className="text-sm text-gray-600">Người trả</label>
            <select className="w-full mt-1 px-3 py-2 rounded-xl border bg-white" {...register('paidBy')}>
              <option value="">—</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            {errors.paidBy && <div className="text-xs text-rose-600 mt-1">{errors.paidBy.message}</div>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-sm text-gray-600">Ngày</label>
            <input type="date" className="w-full mt-1 px-3 py-2 rounded-xl border" {...register('date')} />
            {errors.date && <div className="text-xs text-rose-600 mt-1">{errors.date.message}</div>}
          </div>
          <div>
            <label className="text-sm text-gray-600">Ghi chú</label>
            <input className="w-full mt-1 px-3 py-2 rounded-xl border" {...register('note')} placeholder="tuỳ chọn" />
          </div>
        </div>

        {/* Preview */}
        {amountMinor > 0 && (
          <div className="p-3 rounded-xl bg-gray-50 border mt-3">
            <div className="text-sm font-medium mb-2">Preview chia đều</div>
            <ul className="grid grid-cols-2 gap-2">
              {members.map((m, i) => (
                <li key={m.id} className="px-3 py-2 rounded-lg bg-white border flex items-center justify-between">
                  <span className="text-sm">{m.name}</span>
                  <span className="font-medium">{formatMoney(shares[i], currency)}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs text-gray-500 mt-2">
              Tổng: {formatMoney(shares.reduce((a, b) => a + b, 0), currency)}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border">Huỷ</button>
          <button disabled={isSubmitting} className="flex-1 px-4 py-3 rounded-xl text-white bg-gray-900">Lưu</button>
        </div>
      </form>
    </div>
  );
}
