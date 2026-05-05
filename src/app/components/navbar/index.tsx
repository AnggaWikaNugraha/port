'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, User, LogOut, Languages } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname.startsWith('/admin');

  const logout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    router.push('/pages/login');
  };

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
          <Link href="/pages/blog" className={`hover:text-gray-400 ${pathname === '/pages/blog' ? 'underline' : ''}`}>
            Blog
          </Link>
          <Link href="/pages/projects" className={`hover:text-gray-400 ${pathname === '/pages/projects' ? 'underline' : ''}`}>
            Projects
          </Link>
          <Link href="/pages/about" className={`hover:text-gray-400 ${pathname === '/pages/about' ? 'underline' : ''}`}>
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
