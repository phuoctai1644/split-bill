import { useEffect, useMemo, useState } from 'react';
import { decodeSnapshot, type Snapshot } from '@/utils/snapshot';
import { formatMoney } from '@/utils/money';
import { computeBalances } from '@/utils/balance';
import { settle } from '@/utils/settlement';

export function ShareViewer() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = location.hash.slice(1);
    try {
      if (!hash) throw new Error('Không có dữ liệu chia sẻ');
      setData(decodeSnapshot(hash));
    } catch (e: any) {
      setError(e?.message ?? 'Lỗi đọc dữ liệu');
    }
  }, []);

  const computed = useMemo(() => {
    if (!data) return null;
    const ids = data.members.map(m => m.id);
    const balances = computeBalances(data.expenses as any, ids);
    const txns = settle(balances);
    return { balances, txns };
  }, [data]);

  if (error) return <div className="p-6">{error}</div>;
  if (!data || !computed) return <div className="p-6">Đang tải…</div>;

  const { group, members } = data;
  const nameOf = (id: string) => members.find(m => m.id === id)?.name ?? id;

  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="w-full max-w-[480px] p-4">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b mb-3">
          <div className="px-2 h-14 flex items-center justify-between">
            <div className="font-semibold">{group.name} (Readonly)</div>
          </div>
        </header>

        <section className="p-4 bg-white rounded-2xl shadow-sm">
          <div className="font-semibold mb-2">Số dư</div>
          <ul className="divide-y">
            {members.map((m) => (
              <li key={m.id} className="py-2 flex items-center justify-between">
                <span>{m.name}</span>
                <span className={(computed.balances[m.id] ?? 0) >= 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                  {formatMoney(computed.balances[m.id] ?? 0, group.currency)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-4 bg-white rounded-2xl shadow-sm mt-4">
          <div className="font-semibold mb-2">Settlement</div>
          {computed.txns.length === 0 ? (
            <div className="text-sm text-gray-500">Không cần thanh toán thêm 🎉</div>
          ) : (
            <ul className="space-y-2">
              {computed.txns.map((t, i) => (
                <li key={i} className="px-3 py-3 rounded-xl border flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{nameOf(t.from)}</span> → <span className="font-medium">{nameOf(t.to)}</span>
                  </div>
                  <div className="font-semibold">{formatMoney(t.amount, group.currency)}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="text-xs text-gray-500 mt-6 px-2">
          Chế độ chỉ xem. Chủ nhóm có thể thu hồi link bằng cách tạo snapshot mới (Phase 2 sẽ có token & expiry).
        </footer>
      </div>
    </div>
  );
}
