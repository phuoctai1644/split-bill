import { buildGroupSnapshot } from '@/services/snapshot.service';
import { db } from '@/services/db';
import { computeBalances } from '@/utils/balance';
import { settle } from '@/utils/settlement';

export function ExportJSONButton({ groupId }: { groupId: string }) {
  const onExport = async () => {
    const snap = await buildGroupSnapshot(groupId);
    const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `splitbill_${groupId}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  return <button onClick={onExport} className="px-3 py-2 rounded-xl border text-sm">Export JSON</button>;
}

export function ExportCSVButton({ groupId }: { groupId: string; currency: string }) {
  const onExport = async () => {
    const [group, members, expenses] = await Promise.all([
      db.groups.get(groupId),
      db.members.where('groupId').equals(groupId).toArray(),
      db.expenses.where('groupId').equals(groupId).toArray(),
    ]);
    if (!group) return;

    // expenses.csv
    const exHeader = 'title,amountMinor,currency,paidBy,date,mode\n';
    const exRows = expenses.map(e =>
      `${csv(name(e.title))},${e.amount},${e.currency},${csv(nameId(e.paidBy))},${e.date},${e.splitMode}`
    ).join('\n');

    // settlement.csv
    const ids = members.map(m => m.id);
    const balances = computeBalances(expenses, ids);
    const txns = settle(balances);
    const stHeader = 'from,to,amountMinor\n';
    const stRows = txns.map(t => `${csv(nameId(t.from))},${csv(nameId(t.to))},${t.amount}`).join('\n');

    const zipContent = [
      { name: 'expenses.csv', text: exHeader + exRows },
      { name: 'settlement.csv', text: stHeader + stRows },
    ];

    // simple multi-file download: create a Blob as data URL (no zip lib for MVP)
    const file = new Blob([zipContent.map(f => `---${f.name}---\n${f.text}\n`).join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url; a.download = `export_${groupId}.txt`; a.click();
    URL.revokeObjectURL(url);

    function nameId(id: string) { return members.find(m => m.id === id)?.name ?? id; }
    function name(s: string) { return s ?? ''; }
    function csv(v: string) { return `"${String(v).replace(/"/g, '""')}"`; }
  };
  return <button onClick={onExport} className="px-3 py-2 rounded-xl border text-sm">Export CSV</button>;
}
