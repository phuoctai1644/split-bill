import { useParams } from 'react-router-dom';
import { useGroup } from '@/hooks/useGroups';
import { useGroupBalances } from '@/hooks/useBalances';
import { formatMoney } from '@/utils/money';
import { sumPositive } from '@/utils/balance';
import { useSettlement } from '@/hooks/useSettlement';
import { buildGroupSnapshot } from '@/services/snapshot.service';
import { encodeSnapshot } from '@/utils/snapshot';
import { ExportCSVButton, ExportJSONButton } from '@/features/export/ExportButtons';

function ShareButton({ groupId }: { groupId: string }) {
  const onShare = async () => {
    const snap = await buildGroupSnapshot(groupId);
    const payload = encodeSnapshot(snap);
    const url = `${location.origin}/share#${payload}`;
    await navigator.clipboard.writeText(url);
    alert('Đã copy link chia sẻ (readonly)');
  };
  return (
    <button onClick={onShare} className="px-3 py-2 rounded-xl border text-sm">
      Share (readonly)
    </button>
  );
}

export function SummaryPage() {
  const { id: groupId } = useParams();
  const { data: group } = useGroup(groupId);
  const { balances, members, loading } = useGroupBalances(groupId);

  if (!group) return null;

  const totalPaid = sumPositive(balances);
  const { txns, ok, currency } = useSettlement(groupId);

  if (!group) return null;

  const copySettlement = async () => {
    const name = group.name;
    const lines = txns.map(t => {
      const from = members.find(m => m.id === t.from)?.name ?? t.from;
      const to = members.find(m => m.id === t.to)?.name ?? t.to;
      return `${from} → ${to}: ${formatMoney(t.amount, currency!)}`;
    });
    const text = `Settlement cho "${name}":\n` + lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      alert('Đã copy settlement vào clipboard');
    } catch {
      alert('Không thể copy — hãy chọn tay');
    }
  };

  const exportCSV = () => {
    // CSV: from,to,amount
    const header = 'from,to,amount\n';
    const rows = txns.map(t => {
      const from = members.find(m => m.id === t.from)?.name ?? t.from;
      const to = members.find(m => m.id === t.to)?.name ?? t.to;
      // xuất số minor (chính xác); hoặc thêm cột formatted nếu muốn
      return `${from},${to},${t.amount}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `settlement_${groupId}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top metrics */}
      <div className="flex items-center justify-center gap-3">
        <ShareButton groupId={group.id} />
        <ExportJSONButton groupId={group.id} />
        <ExportCSVButton groupId={group.id} currency={group.currency} />
      </div>
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

      <section className="p-4 bg-white rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Settlement</div>
          <div className="flex gap-2">
            <button onClick={copySettlement} className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm">
              Copy
            </button>
            <button onClick={exportCSV} className="px-3 py-2 rounded-xl border text-sm">
              Export CSV
            </button>
          </div>
        </div>

        {!txns.length && (
          <div className="text-sm text-gray-500">Không cần thanh toán thêm 🎉</div>
        )}

        {!!txns.length && (
          <ul className="space-y-2">
            {txns.map((t, i) => {
              const from = members.find(m => m.id === t.from)?.name ?? t.from;
              const to = members.find(m => m.id === t.to)?.name ?? t.to;
              return (
                <li key={i} className="px-3 py-3 rounded-xl border flex items-center justify-between">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">{from}</span> → <span className="font-medium">{to}</span>
                    </div>
                    {!ok && <div className="text-[11px] text-amber-600">Warning: validation failed</div>}
                  </div>
                  <div className="font-semibold">{formatMoney(t.amount, currency!)}</div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
