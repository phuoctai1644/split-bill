import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupForm, type GroupForm } from './schemas';

const CURRENCIES = ['VND', 'USD', 'EUR'] as const;

export function GroupFormModal({
  initial,
  onSubmit,
  onClose,
}: {
  initial?: Partial<GroupForm>;
  onSubmit: (values: GroupForm) => void;
  onClose: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GroupForm>({
    resolver: zodResolver(groupForm),
    defaultValues: { name: initial?.name ?? '', currency: (initial?.currency as any) ?? 'VND' },
  });

  return (
    <div className="fixed inset-0 z-30 bg-black/50 flex items-end">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[480px] mx-auto bg-white rounded-t-3xl p-4"
      >
        <div className="font-semibold mb-3">{initial ? 'Sửa nhóm' : 'Tạo nhóm'}</div>

        <label className="text-sm text-gray-600">Tên nhóm</label>
        <input className="w-full mt-1 px-3 py-2 rounded-xl border" {...register('name')} />
        {errors.name && <div className="text-xs text-rose-600 mt-1">{errors.name.message}</div>}

        <label className="text-sm text-gray-600 mt-3 block">Currency</label>
        <select className="w-full mt-1 px-3 py-2 rounded-xl border bg-white" {...register('currency')}>
          {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border">Huỷ</button>
          <button disabled={isSubmitting} className="flex-1 px-4 py-3 rounded-xl text-white bg-gray-900">
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
