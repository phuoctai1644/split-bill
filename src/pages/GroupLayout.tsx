import { Outlet, useParams, Link } from 'react-router-dom';
import { AppShell } from '../app/AppShell';
import { useGroupsStore } from '../stores/groups';

export function GroupLayout() {
  const { id } = useParams();
  const group = useGroupsStore((s) => s.groups.find((g) => g.id === id));
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
      <Outlet />
    </AppShell>
  );
}
