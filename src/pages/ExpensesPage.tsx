import { Skeleton } from "../components/Skeleton";


export function ExpensesPage() {
  return (
    <div className="space-y-4">
      <section className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Chi tiêu</h2>
        <button className="px-3 py-2 rounded-xl bg-gray-900 text-white text-sm">Thêm</button>
      </section>

      <ul className="space-y-3">
        <li className="p-6 text-center text-gray-500 bg-white rounded-2xl">
          Chưa có chi tiêu nào (Day 4-5 sẽ thêm form + preview).
        </li>
      </ul>

      {/* demo skeleton */}
      {false && (
        <div className="space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      )}
    </div>
  );
}
