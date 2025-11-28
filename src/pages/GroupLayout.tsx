import { Outlet, useParams, Link } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { useGroup } from '@/hooks/useGroups';
import { useMembers, useCreateMember, useDeleteMember, useUpdateMember } from '@/hooks/useMembers';
import { MemberInlineForm } from '@/features/members/MemberInlineForm';
import { EditMemberModal } from '@/features/members/EditMemberModal';
import { useMemo, useState } from 'react';
import type { Member } from '@/services/db';

export function GroupLayout() {
  const { id } = useParams();
  const { data: group } = useGroup(id);
  const { data: members = [] } = useMembers(id!);
  const createMember = useCreateMember(id!);
  const deleteMember = useDeleteMember(id!);
  const updateMember = useUpdateMember(id!);

  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const isDup = useMemo(
    () => (name: string) => members.some(m => m.name.toLowerCase() === name.trim().toLowerCase()),
    [members]
  );

  const handleSaveMember = (payload: { id: string; name: string; alias?: string }) => {
    updateMember.mutate({
      id: payload.id,
      patch: { name: payload.name, alias: payload.alias }
    });
    setEditingMember(null);
  };

  const handleCloseEditModal = () => {
    setEditingMember(null);
  };

  if (!group) {
    return (
      <AppShell title="Không tìm thấy nhóm">
        <div className="p-6 rounded-2xl bg-white shadow-sm">
          Nhóm không tồn tại. <Link to="/groups" className="text-indigo-600">Quay lại danh sách</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={group.name}
      tabs={[
        { to: `/groups/${group.id}/expenses`, label: 'Expenses' },
        { to: `/groups/${group.id}/summary`, label: 'Summary' },
        { to: `/groups`, label: 'Groups' },
      ]}
    >
      {/* Members manager */}
      <section className="p-4 bg-white rounded-2xl shadow-sm mb-4">
        <div className="font-semibold mb-2">Thành viên</div>
        <MemberInlineForm
          isDuplicate={isDup}
          onSubmit={(v) => createMember.mutate({ name: v.name, alias: v.alias })}
        />
        <ul className="divide-y mt-3">
          {members.map((m) => (
            <li key={m.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{m.name}</div>
                {m.alias && <div className="text-xs text-gray-500">{m.alias}</div>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingMember(m)}
                  className="px-3 py-1.5 rounded-xl border text-sm hover:bg-gray-50 transition-colors"
                >
                  Sửa
                </button>
                <button
                  onClick={() => {
                    if (confirm('Bạn có chắc chắn muốn xoá thành viên này?')) {
                      deleteMember.mutate(m.id);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl border text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Xoá
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Outlet />

      {/* Edit Member Modal */}
      <EditMemberModal
        member={editingMember}
        onClose={handleCloseEditModal}
        onSave={handleSaveMember}
      />
    </AppShell>
  );
}
