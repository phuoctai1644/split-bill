import { PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';

type Tab = { to: string; label: string; icon?: React.ReactNode };

export function AppShell({
  title,
  tabs,
  children,
}: PropsWithChildren<{ title: string; tabs?: Tab[] }>) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="w-full max-w-[480px] flex flex-col">
        {/* AppBar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
          <div className="px-4 h-14 flex items-center justify-between">
            <div className="font-semibold">{title}</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 pb-24">{children}</main>

        {/* Bottom Tabs */}
        {tabs?.length ? (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 backdrop-blur border-t">
            <div className="grid grid-cols-3 px-2 py-2">
              {tabs.map((t) => {
                const active = pathname === t.to;
                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    className={`flex flex-col items-center gap-1 py-1 rounded-xl ${
                      active ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {t.icon}
                    <span className="text-[11px]">{t.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        ) : null}
      </div>
    </div>
  );
}
