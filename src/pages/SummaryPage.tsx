export function SummaryPage() {
  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <div className="text-xs text-gray-500">Tổng đã trả</div>
          <div className="text-lg font-semibold">—</div>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-sm">
          <div className="text-xs text-gray-500">Số giao dịch gợi ý</div>
          <div className="text-lg font-semibold">—</div>
        </div>
      </section>

      <section className="p-4 bg-white rounded-2xl shadow-sm">
        <div className="font-semibold mb-2">Số dư</div>
        <div className="text-sm text-gray-500">Sẽ hiển thị khi có chi tiêu (Day 6–7).</div>
      </section>

      <section className="p-4 bg-white rounded-2xl shadow-sm">
        <div className="font-semibold mb-2">Settlement</div>
        <div className="text-sm text-gray-500">Thuật toán sẽ được gắn Day 7.</div>
      </section>
    </div>
  );
}
