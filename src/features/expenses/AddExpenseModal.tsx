import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseAnyForm, type ExpenseAnyForm } from './schemas';
import { toMinor, formatMoney, formatNumberWithCommas, removeCommas, isValidNumberInput } from '@/utils/money';
import { equalSplit, weightsSplit, sumEquals } from '@/utils/split';
import { Currency } from '@/services/db';

type MemberLite = { id: string; name: string };

type ExpensePayload = {
  title: string; amount: number; currency: Currency; paidBy: string; date: string; note?: string;
  splitMode: 'equal' | 'weights' | 'exact';
  weights?: Record<string, number>;
  exacts?: Record<string, number>;
};

export function AddExpenseModal({
  currency, members, onClose, onSave,
}: {
  currency: Currency;
  members: MemberLite[];
  onClose: () => void;
  onSave: (payload: ExpensePayload) => void;
}) {
  const [mode, setMode] = useState<'equal' | 'weights' | 'exact'>('equal');
  const [displayAmount, setDisplayAmount] = useState<string>('');
  const [displayExacts, setDisplayExacts] = useState<Record<string, string>>({});

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<ExpenseAnyForm>({
      resolver: zodResolver(expenseAnyForm),
      defaultValues: {
        title: '',
        amountMajor: 0,
        paidBy: members[0]?.id ?? '',
        date: new Date().toISOString().slice(0, 10),
        note: '',
        splitMode: 'equal',
      } as ExpenseAnyForm,
    });

  // keep form splitMode synced with local mode toggle
  const onSwitch = (m: typeof mode) => {
    setMode(m);
    setValue('splitMode', m);
    if (m === 'weights') {
      setValue('weights', Object.fromEntries(members.map(mem => [mem.id, 1])));
    }
    if (m === 'exact') {
      setValue('exactsMajor', Object.fromEntries(members.map(mem => [mem.id, 0])));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Only allow valid number input
    if (inputValue === '' || isValidNumberInput(inputValue)) {
      const rawValue = removeCommas(inputValue);
      const numericValue = parseFloat(rawValue) || 0;

      // Update form state with numeric value
      setValue('amountMajor', numericValue);

      // Update display with formatted value
      if (rawValue === '' || rawValue === '0') {
        setDisplayAmount('');
      } else {
        setDisplayAmount(formatNumberWithCommas(rawValue));
      }
    }
  };

  const handleExactChange = (memberId: string, value: string) => {
    // Only allow valid number input
    if (value === '' || isValidNumberInput(value)) {
      const rawValue = removeCommas(value);
      const numericValue = parseFloat(rawValue) || 0;

      // Update form state with numeric value
      setValue(`exactsMajor.${memberId}` as const, numericValue);

      // Update display with formatted value
      setDisplayExacts(prev => ({
        ...prev,
        [memberId]: rawValue === '' || rawValue === '0' ? '' : formatNumberWithCommas(rawValue)
      }));
    }
  };

  const amountMinor = toMinor(Number(watch('amountMajor') || 0), currency);
  const weights = members.reduce((acc, m) => {
    acc[m.id] = watch(`weights.${m.id}`);
    return acc;
  }, {} as Record<string, number>);
  const exactsMajor = members.reduce((acc, m) => {
    acc[m.id] = watch(`exactsMajor.${m.id}`);
    return acc;
  }, {} as Record<string, number>);

  const shares = useMemo(() => {
    if (amountMinor <= 0) return members.map(() => 0);
    if (mode === 'equal') return equalSplit(amountMinor, members.length);
    if (mode === 'weights') return weightsSplit(amountMinor, members.map(m => Number(weights[m.id] || 0)));
    if (mode === 'exact') return members.map(m => toMinor(Number(exactsMajor[m.id] || 0), currency));
    return [];
  }, [mode, amountMinor, members, weights, exactsMajor, currency]);

  const sumPreview = shares.reduce((a, b) => a + b, 0);
  const exactOk = mode !== 'exact' || sumEquals(amountMinor, shares);

  const submit = handleSubmit((v) => {
    // convert -> payload chuẩn DB
    const payload: ExpensePayload = {
      title: v.title.trim(),
      amount: amountMinor,
      currency,
      paidBy: v.paidBy,
      date: v.date,
      note: v.note?.trim() || undefined,
      splitMode: v.splitMode,
    };
    if (v.splitMode === 'weights') payload.weights = v.weights;
    if (v.splitMode === 'exact') {
      payload.exacts = Object.fromEntries(
        Object.entries(v.exactsMajor!).map(([id, maj]) => [id, toMinor(Number(maj || 0), currency)])
      );
    }
    onSave(payload);
  });

  return (
    <div className="fixed inset-0 z-30 bg-black/50 flex items-end">
      <form onSubmit={submit} className="w-full max-w-[480px] mx-auto bg-white rounded-t-3xl p-4">
        <div className="font-semibold mb-3">Thêm chi tiêu</div>

        {/* fields chung */}
        <label className="text-sm text-gray-600">Tiêu đề</label>
        <input className="w-full mt-1 px-3 py-2 rounded-xl border" {...register('title')} />
        {errors.title && <div className="text-xs text-rose-600 mt-1">{errors.title.message}</div>}

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-sm text-gray-600">Số tiền ({currency})</label>
            <input
              type="text"
              inputMode="decimal"
              className="w-full mt-1 px-3 py-2 rounded-xl border"
              value={displayAmount}
              onChange={handleAmountChange}
              placeholder="0"
            />
            <input type="hidden" {...register('amountMajor', { valueAsNumber: true })} />
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

        {/* Mode selector */}
        <div className="mt-3">
          <label className="text-sm text-gray-600">Cách chia</label>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {(['equal', 'weights', 'exact'] as const).map((m) => (
              <button key={m} type="button" onClick={() => onSwitch(m)}
                className={`px-3 py-2 rounded-xl border text-sm ${mode === m ? 'bg-gray-900 text-white' : 'bg-white'}`}>
                {m === 'equal' ? 'Đều' : m === 'weights' ? 'Trọng số' : 'Cụ thể'}
              </button>
            ))}
          </div>
          <input type="hidden" {...register('splitMode')} />
        </div>

        {/* Weights input */}
        {mode === 'weights' && (
          <div className="p-3 rounded-xl border mt-3">
            <div className="text-sm font-medium mb-2">Trọng số</div>
            <div className="grid grid-cols-3 gap-2">
              {members.map((m) => (
                <div key={m.id} className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">{m.name}</label>
                  <input type="number" inputMode="decimal" className="px-2 py-1 rounded-lg border"
                    {...register(`weights.${m.id}` as const, { valueAsNumber: true, min: 0 })} step="any" />
                </div>
              ))}
            </div>
            {errors && 'weights' in errors && errors?.weights && <div className="text-xs text-rose-600 mt-2">Tổng trọng số phải {'>'} 0</div>}
          </div>
        )}

        {/* Exact input */}
        {mode === 'exact' && (
          <div className="p-3 rounded-xl border mt-3">
            <div className="text-sm font-medium mb-2">Nhập số cụ thể ({currency})</div>
            <div className="grid grid-cols-3 gap-2">
              {members.map((m) => (
                <div key={m.id} className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">{m.name}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="px-2 py-1 rounded-lg border"
                    value={displayExacts[m.id] || ''}
                    onChange={(e) => handleExactChange(m.id, e.target.value)}
                    placeholder="0"
                  />
                  <input type="hidden" {...register(`exactsMajor.${m.id}` as const, { valueAsNumber: true, min: 0 })} />
                </div>
              ))}
            </div>
            <div className={`text-xs mt-2 ${exactOk ? 'text-emerald-600' : 'text-rose-600'}`}>
              Tổng nhập: {formatMoney(sumPreview, currency)} / {formatMoney(amountMinor, currency)}
            </div>
          </div>
        )}

        {/* Preview */}
        {amountMinor > 0 && (
          <div className="p-3 rounded-xl bg-gray-50 border mt-3">
            <div className="text-sm font-medium mb-2">Preview</div>
            <ul className="grid grid-cols-2 gap-2">
              {members.map((m, i) => (
                <li key={m.id} className="px-3 py-2 rounded-lg bg-white border flex items-center justify-between">
                  <span className="text-sm">{m.name}</span>
                  <span className="font-medium">{formatMoney(shares[i], currency)}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs text-gray-500 mt-2">
              Tổng: {formatMoney(sumPreview, currency)}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border">Huỷ</button>
          <button disabled={isSubmitting || (mode === 'exact' && !exactOk)}
            className="flex-1 px-4 py-3 rounded-xl text-white bg-gray-900">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
