import { useParams } from 'react-router-dom';
import { useMembers } from '@/hooks/useMembers';
import { useExpenses, useCreateExpense } from '@/hooks/useExpenses';
import { AddExpenseEqualModal } from '@/features/expenses/AddExpenseEqualModal';
import { useState } from 'react';
import { useGroup } from '@/hooks/useGroups';
import { formatMoney } from '@/utils/money';

export function ExpensesPage() {
  const { id: groupId } = useParams();
  const { data: group } = useGroup(groupId);
  const { data: members = [] } = useMembers(groupId!);
  const { data: expenses = [] } = useExpenses(groupId!);
  const createExpense = useCreateExpense(groupId!);
  const [show, setShow] = useState(false);

  if (!group) return null;

  return (
    <div className="space-y-4">
      <section className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Chi tiêu</h2>
        <button onClick={() => setShow(true)} className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm">
          Thêm (Đều)
        </button>
      </section>

      <ul className="space-y-3">
        {expenses.map((e) => {
          const payer = members.find((m) => m.id === e.paidBy)?.name || e.paidBy;
          return (
            <li key={e.id} className="p-4 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {payer} • {new Date(e.date).toLocaleDateString('vi-VN')} • {e.splitMode}
                  </div>
                </div>
                <div className="font-semibold">{formatMoney(e.amount, e.currency)}</div>
              </div>
              {e.note ? <div className="text-xs text-gray-600 mt-2">{e.note}</div> : null}
            </li>
          );
        })}
      </ul>

      {expenses.length === 0 && (
        <div className="p-6 text-center text-gray-500 bg-white rounded-2xl">
          Chưa có chi tiêu nào. Nhấn “Thêm (Đều)”.
        </div>
      )}

      {show && (
        <AddExpenseEqualModal
          currency={group.currency}
          members={members}
          onClose={() => setShow(false)}
          onSave={async (payload) => {
            await createExpense.mutateAsync({ ...payload, groupId: groupId! });
            setShow(false);
          }}
        />
      )}
    </div>
  );
}
