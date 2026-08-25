'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, LayoutDashboard, User, LogOut, Languages } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname.startsWith('/admin');
  const isLanguageLab = pathname === '/pages/language';

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950 border-b border-gray-800 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className={`text-xl font-semibold ${pathname === '/' ? 'underline' : ''}`}>
          Home
        </Link>
        <div className="space-x-6 text-sm">
          <Link href="/pages/projects" className={`hover:text-gray-400 ${pathname === '/pages/projects' ? 'underline' : ''}`}>
            Projects
          </Link>
          <Link href="/pages/blog" className={`hover:text-gray-400 ${pathname === '/pages/blog' ? 'underline' : ''}`}>
            Blog
          </Link>
          <Link href="/pages/about" className={`hover:text-gray-400 ${pathname === '/pages/about' ? 'underline' : ''}`}>
            About
          </Link>
          <Link href="/pages/language" className={`hover:text-gray-400 ${pathname === '/pages/language' ? 'underline' : ''}`}>
            Language
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
