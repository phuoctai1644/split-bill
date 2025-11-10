import { Outlet, useParams, Link } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { useGroup } from '@/hooks/useGroups';
import { useMembers, useCreateMember, useDeleteMember, useUpdateMember } from '@/hooks/useMembers';
import { MemberInlineForm } from '@/features/members/MemberInlineForm';
import { useMemo } from 'react';

export function GroupLayout() {
  const { id } = useParams();
  const { data: group } = useGroup(id);
  const { data: members = [] } = useMembers(id!);
  const createMember = useCreateMember(id!);
  const deleteMember = useDeleteMember(id!);
  const updateMember = useUpdateMember(id!);

  const isDup = useMemo(
    () => (name: string) => members.some(m => m.name.toLowerCase() === name.trim().toLowerCase()),
    [members]
  );

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
                  onClick={() => {
                    const name = prompt('Tên mới', m.name) ?? m.name;
                    const alias = prompt('Alias (tuỳ chọn)', m.alias ?? '') ?? m.alias ?? '';
                    updateMember.mutate({ id: m.id, patch: { name, alias } });
                  }}
                  className="px-3 py-1.5 rounded-xl border text-sm"
                >
                  Sửa
                </button>
                <button
                  onClick={() => {
                    if (confirm('Bạn có chắc chắn muốn xoá thành viên này?')) {
                      deleteMember.mutate(m.id);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl border text-sm text-red-600"
                >
                  Xoá
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Outlet />
    </AppShell>
  );
}
