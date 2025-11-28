import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { memberEditForm, type MemberEditForm } from '@/features/groups/schemas';
import { BottomSheetModal } from '@/components/BottomSheetModal';

type Member = {
  id: string;
  name: string;
  alias?: string | null;
};

export function EditMemberModal({
  member,
  onClose,
  onSave,
}: {
  member: Member | null;
  onClose: () => void;
  onSave: (payload: { id: string; name: string; alias?: string }) => void;
}) {
  if (!member) return null;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<MemberEditForm>({
    resolver: zodResolver(memberEditForm),
    defaultValues: {
      name: member.name,
      alias: member.alias || ''
    }
  });

  const handleClose = () => {
    if (isDirty) {
      if (confirm('Bạn có chắc muốn bỏ thay đổi?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const submit = handleSubmit((values) => {
    onSave({
      id: member.id,
      name: values.name.trim(),
      alias: values.alias?.trim() || undefined
    });
  });

  return (
    <BottomSheetModal
      isOpen={true}
      title="Sửa thành viên"
      onClose={handleClose}
      asForm
      onSubmit={submit}
      footer={
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={handleClose} className="flex-1 px-4 py-3 rounded-xl border">Huỷ</button>
          <button disabled={isSubmitting} className="flex-1 px-4 py-3 rounded-xl text-white bg-gray-900">Lưu</button>
        </div>
      }
    >
      <label className="text-sm text-gray-600">Tên</label>
      <input className="w-full mt-1 px-3 py-2 rounded-xl border" {...register('name')} />
      {errors.name && <div className="text-xs text-rose-600 mt-1">{errors.name.message}</div>}

      <label className="text-sm text-gray-600 mt-3 block">Alias (tuỳ chọn)</label>
      <input className="w-full mt-1 px-3 py-2 rounded-xl border" {...register('alias')} placeholder="tuỳ chọn" />

    </BottomSheetModal>
  );
}