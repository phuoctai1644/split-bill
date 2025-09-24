import type { Expense } from '@/services/db';
import { equalSplit, weightsSplit } from '@/utils/split';

/**
 * Tính số tiền "mỗi người OWE" cho 1 expense (đơn vị minor, integer)
 * Trả về map memberId -> owedMinor (>= 0)
 * Giả định "participants = tất cả members" cho MVP
 */
export function owedPerExpense(
  e: Expense,
  participants: string[],
): Record<string, number> {
  const total = e.amount; // minor, đã đúng currency nhóm trong MVP
  const zero = Object.fromEntries(participants.map((id) => [id, 0]));
  if (participants.length === 0 || total <= 0) return zero;

  if (e.splitMode === 'equal') {
    const shares = equalSplit(total, participants.length);
    return Object.fromEntries(participants.map((id, i) => [id, shares[i]]));
  }

  if (e.splitMode === 'weights') {
    const weights = participants.map((id) => e.weights?.[id] ?? 0);
    const shares = weightsSplit(total, weights);
    return Object.fromEntries(participants.map((id, i) => [id, shares[i]]));
  }

  // exact
  return Object.fromEntries(participants.map((id) => [id, e.exacts?.[id] ?? 0]));
}

/**
 * Tính balance theo nhóm:
 * balance[memberId] = paidTotal - owedTotal (minor)
 */
export function computeBalances(
  expenses: Expense[],
  memberIds: string[],
): Record<string, number> {
  const bal: Record<string, number> = Object.fromEntries(memberIds.map((id) => [id, 0]));

  for (const e of expenses) {
    const participants = memberIds; // MVP: mọi người trong nhóm đều tham gia
    const owed = owedPerExpense(e, participants);

    // subtract owed
    for (const id of participants) bal[id] -= owed[id] || 0;

    // add payer credit
    bal[e.paidBy] = (bal[e.paidBy] ?? 0) + e.amount;
  }
  return bal;
}

/** Convenience helpers */
export const sumPositive = (m: Record<string, number>) =>
  Object.values(m).reduce((a, b) => a + (b > 0 ? b : 0), 0);

export const splitSides = (m: Record<string, number>) => {
  const creditors: { id: string; amt: number }[] = [];
  const debtors: { id: string; amt: number }[] = [];
  for (const [id, v] of Object.entries(m)) {
    if (v > 0) creditors.push({ id, amt: v });
    else if (v < 0) debtors.push({ id, amt: -v });
  }
  return { creditors, debtors };
};
