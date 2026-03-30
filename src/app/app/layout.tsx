'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user);
    });
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Top nav */}
      <nav className="glass-strong" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2 font-bold" style={{ fontFamily: 'Space Grotesk' }}>
            <span>✂️</span>
            <span className="text-gradient">Hairly</span>
            <span>AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/app/settings"
              className="text-sm px-4 py-2 rounded-lg transition-colors"
              style={{
                color: 'var(--text-secondary)',
                background: 'transparent',
              }}
            >
              ⚙️ Settings
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--gradient-main)', color: 'white' }}
                >
                  {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || '?').toUpperCase()}
                </div>
                <span className="text-sm hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>
                  {user?.user_metadata?.full_name || user?.email || ''}
                </span>
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 py-2 glass-strong"
                  style={{ borderRadius: 'var(--radius-md)', zIndex: 50 }}
                >
                  <Link
                    href="/app/settings"
                    className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setShowMenu(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    href="/pricing"
                    className="block px-4 py-2 text-sm transition-colors hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setShowMenu(false)}
                  >
                    Pricing
                  </Link>
                  <div className="my-1" style={{ borderTop: '1px solid var(--border-subtle)' }} />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/5"
                    style={{ color: '#ef4444' }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
