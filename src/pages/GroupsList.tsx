import { AppShell } from '@/app/AppShell';
import { useGroups, useCreateGroup, useDeleteGroup } from '@/hooks/useGroups';
import { GroupFormModal } from '@/features/groups/GroupForm';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function GroupsList() {
  const nav = useNavigate();
  const { data: groups = [] } = useGroups();
  const createGroup = useCreateGroup();
  const deleteGroup = useDeleteGroup();
  const [show, setShow] = useState(false);

  return (
    <AppShell title="Groups">
      <div className="mb-3">
        <button onClick={() => setShow(true)} className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm">
          Tạo nhóm
        </button>
      </div>

      <ul className="space-y-3">
        {groups.map((g) => (
          <li
            key={g.id}
            className="p-4 bg-white rounded-2xl shadow-sm flex items-center justify-between cursor-pointer"
            onClick={() => nav(`/groups/${g.id}`)}
          >
            <div>
              <div className="font-medium">{g.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {new Date(g.createdAt).toLocaleDateString('vi-VN')} • {g.currency}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/groups/${g.id}/expenses`}
                className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                Mở
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Bạn có chắc chắn muốn xoá nhóm này?')) {
                    deleteGroup.mutate(g.id);
                  }
                }}
                className="px-3 py-2 rounded-xl border text-sm"
              >
                Xoá
              </button>
            </div>
          </li>
        ))}
      </ul>

      {groups.length === 0 && (
        <div className="p-6 rounded-2xl bg-white shadow-sm text-center text-gray-500">
          Chưa có nhóm nào. Nhấn “Tạo nhóm”.
        </div>
      )}

      {show && (
        <GroupFormModal
          onClose={() => setShow(false)}
          onSubmit={async (values) => {
            const g = await createGroup.mutateAsync(values);
            setShow(false);
            nav(`/groups/${g.id}/expenses`);
          }}
        />
      )}
    </AppShell>
  );
}
