// src/components/Navbar.tsx
'use client';
import Link from 'next/link'
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950 border-b border-gray-800 text-white px-6 py-4">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <Link href="/" className={`text-xl font-semibold ${pathname === '/' ? 'underline' : ''}`}>
        Home
      </Link>
      <div className="space-x-6 text-sm">
        <Link
          href="/pages/blog"
          className={`hover:text-gray-400 ${pathname === '/pages/blog' ? 'underline' : ''}`}
        >
          Blog
        </Link>
        <Link
          href="/pages/projects"
          className={`hover:text-gray-400 ${pathname === '/pages/projects' ? 'underline' : ''}`}
        >
          Projects
        </Link>
        <Link
          href="/pages/about"
          className={`hover:text-gray-400 ${pathname === '/pages/about' ? 'underline' : ''}`}
        >
          About
        </Link>
      </div>
    </div>
  </nav>
  );
};

export default Navbar;
