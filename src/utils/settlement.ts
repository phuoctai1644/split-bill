export type Txn = { from: string; to: string; amount: number }; // minor units

/**
 * Greedy settlement:
 * - creditors: balance > 0 (người được nhận)
 * - debtors:   balance < 0 (người phải trả) → dùng trị tuyệt đối
 * Kết quả: danh sách giao dịch min-count theo chiến lược ghép lớn-nhất với lớn-nhất.
 */
export function settle(balances: Record<string, number>): Txn[] {
  const creditors: { id: string; amt: number }[] = [];
  const debtors:   { id: string; amt: number }[] = [];

  for (const [id, v] of Object.entries(balances)) {
    if (v > 0) creditors.push({ id, amt: v });
    else if (v < 0) debtors.push({ id, amt: -v });
  }
  // early exits
  if (!creditors.length || !debtors.length) return [];

  const txns: Txn[] = [];
  // Lặp cho tới khi hết một bên
  while (creditors.length && debtors.length) {
    creditors.sort((a, b) => b.amt - a.amt);
    debtors.sort((a, b) => b.amt - a.amt);

    const c = creditors[0];
    const d = debtors[0];
    const pay = Math.min(c.amt, d.amt);

    if (pay > 0) {
      txns.push({ from: d.id, to: c.id, amount: pay });
      c.amt -= pay;
      d.amt -= pay;
    }

    if (c.amt === 0) creditors.shift();
    if (d.amt === 0) debtors.shift();
  }
  return txns;
}

/** Invariants kiểm tra nhanh */
export function validateSettlement(
  balances: Record<string, number>,
  txns: Txn[],
): boolean {
  const adj: Record<string, number> = { ...balances };
  for (const t of txns) {
    adj[t.from] += t.amount; // debtor tăng vì đã trả
    adj[t.to]   -= t.amount; // creditor giảm vì đã nhận
  }
  // tất cả gần 0 (chính xác 0 vì integer)
  return Object.values(adj).every(v => v === 0);
}
