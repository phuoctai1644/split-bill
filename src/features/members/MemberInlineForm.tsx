import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberForm, type MemberForm } from '@/features/groups/schemas';

export function MemberInlineForm({
  onSubmit, isDuplicate,
}: { onSubmit: (values: MemberForm) => void; isDuplicate: (name: string) => boolean }) {
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } =
    useForm<MemberForm>({ resolver: zodResolver(memberForm), defaultValues: { name: '', alias: '' } });

  const submit = handleSubmit((values) => {
    if (isDuplicate(values.name)) {
      setError('name', { message: 'Tên đã tồn tại trong nhóm' });
      return;
    }
    onSubmit(values);
    reset();
  });

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input placeholder="Tên thành viên" className="flex-1 px-3 py-2 rounded-xl border" {...register('name')} />
      <input placeholder="Alias (tuỳ chọn)" className="w-36 px-3 py-2 rounded-xl border" {...register('alias')} />
      <button disabled={isSubmitting} className="px-3 py-2 rounded-xl bg-gray-900 text-white">Thêm</button>
      {errors.name && <div className="text-xs text-rose-600 self-center">{errors.name.message}</div>}
    </form>
  );
}
