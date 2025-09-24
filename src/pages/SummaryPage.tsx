import { useParams } from 'react-router-dom';
import { useGroup } from '@/hooks/useGroups';
import { useGroupBalances } from '@/hooks/useBalances';
import { formatMoney } from '@/utils/money';
import { sumPositive } from '@/utils/balance';

export function SummaryPage() {
  const { id: groupId } = useParams();
  const { data: group } = useGroup(groupId);
  const { balances, members, loading } = useGroupBalances(groupId);

  if (!group) return null;

  const totalPaid = sumPositive(balances);
  const currency = group.currency;

  return (
    <div className="space-y-4">
      {/* Top metrics */}
      <section className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <div className="text-xs text-gray-500">Tổng tiền đã trả</div>
          <div className="text-lg font-semibold">
            {formatMoney(totalPaid, currency)}
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <div className="text-xs text-gray-500">Số thành viên</div>
          <div className="text-lg font-semibold">{members.length}</div>
        </div>
      </section>

      {/* Balances table */}
      <section className="p-4 bg-white rounded-2xl shadow-sm">
        <div className="font-semibold mb-2">Số dư</div>

        {loading && <div className="text-sm text-gray-500">Đang tải…</div>}

        {!loading && members.length === 0 && (
          <div className="text-sm text-gray-500">
            Chưa có thành viên. Thêm thành viên để bắt đầu.
          </div>
        )}

        {!loading && members.length > 0 && (
          <ul className="divide-y">
            {members.map((m) => (
              <li key={m.id} className="py-2 flex items-center justify-between">
                <span>{m.name}</span>
                <span
                  className={
                    (balances[m.id] ?? 0) >= 0
                      ? 'text-emerald-600 font-medium'
                      : 'text-rose-600 font-medium'
                  }
                >
                  {formatMoney(balances[m.id] ?? 0, currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Placeholder for Day 7 Settlement list */}
      <section className="p-4 bg-white rounded-2xl shadow-sm">
        <div className="font-semibold mb-1">Settlement</div>
        <div className="text-sm text-gray-500">
          Ngày 7 sẽ hiển thị gợi ý ai trả cho ai.
        </div>
      </section>
    </div>
  );
}
