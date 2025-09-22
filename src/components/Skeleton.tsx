export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full rounded-2xl bg-gray-200 animate-pulse ${className}`} />
  );
}