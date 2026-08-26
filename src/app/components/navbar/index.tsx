'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  FolderKanban,
  Home,
  Languages,
  LayoutDashboard,
  LogOut,
  User,
  UserRound,
} from 'lucide-react';

const publicNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/pages/projects', label: 'Projects', icon: FolderKanban },
  { href: '/pages/blog', label: 'Blog', icon: FileText },
  { href: '/pages/about', label: 'About', icon: UserRound },
  { href: '/pages/language', label: 'Language', icon: Languages },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname.startsWith('/admin');
  const isLanguageLab = pathname === '/pages/language';
  const isLogin = pathname === '/pages/login';

  const logout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    router.push('/pages/login');
  };

  if (isLanguageLab) {
    return (
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#d6e3e3] bg-[#edf4f4]/95 px-4 py-3 text-[#214f57] backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between">
          <Link href="/pages/language" className="flex items-center gap-2 font-[Georgia,serif] text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#155e6c] text-white"><Languages className="h-4 w-4" /></span>
            LanguageLab
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-[#cfdddd] bg-white px-3 py-2 text-sm font-semibold text-[#52747a] transition hover:bg-[#f7fafa]">
            <ArrowLeft className="h-4 w-4" /> Back to portfolio
          </Link>
        </div>
      </nav>
    );
  }

  if (isAdmin) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950 border-b border-gray-800 text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Admin</span>

          <div className="flex items-center gap-1">
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === '/admin/dashboard'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            <Link
              href="/admin/profile"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === '/admin/profile'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>

            <Link
              href="/admin/language"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                pathname === '/admin/language'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Languages className="w-4 h-4" />
              Language
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  if (isLogin) return null;

  return (
    <>
      {/* Floating side navigation */}
      <nav
        aria-label="Primary navigation"
        className="fixed left-2 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-1 rounded-full border border-white/10 bg-gray-900/90 p-1 text-gray-400 shadow-2xl shadow-black/40 backdrop-blur-xl sm:left-4 sm:p-1.5 xl:left-6"
      >
        {publicNavItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative grid h-9 w-9 place-items-center rounded-full outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/70 sm:h-11 sm:w-11 ${
                isActive
                  ? 'bg-white text-gray-950 shadow-lg shadow-black/30'
                  : 'hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-full ml-3 translate-x-1 whitespace-nowrap rounded-lg border border-white/10 bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-200 opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Navbar;
