import { Link } from 'react-router-dom';
import { useGroupsStore } from '../stores/groups';
import { AppShell } from '../app/AppShell';
import { Skeleton } from '../components/Skeleton';

export function GroupsList() {
  const groups = useGroupsStore((s) => s.groups);

  return (
    <AppShell title="Groups">
      {groups.length === 0 ? (
        <div className="p-6 rounded-2xl bg-white shadow-sm text-center text-gray-500">
          Chưa có nhóm nào. Nhấn “Tạo nhóm” (sẽ làm ở Day 3).
        </div>
      ) : (
        <ul className="space-y-3">
          {groups.map((g) => (
            <li key={g.id} className="p-4 bg-white rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <div className="font-medium">{g.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {new Date(g.createdAt).toLocaleDateString('vi-VN')} • {g.currency}
                </div>
              </div>
              <Link
                to={`/groups/${g.id}/expenses`}
                className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm"
              >
                Mở
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* demo skeleton (khi load Dexie sau này) */}
      {false && (
        <div className="mt-3 space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      )}
    </AppShell>
  );
}
