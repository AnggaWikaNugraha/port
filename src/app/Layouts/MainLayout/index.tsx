'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../../components/navbar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const usesTopNavigation = pathname.startsWith('/admin') || pathname === '/pages/language';
  const isLogin = pathname === '/pages/login';

  return (
    <div className='min-h-screen bg-gray-950 text-white'>
      <Navbar />
      <div
        className={`min-h-screen flex flex-col ${
          usesTopNavigation ? 'pt-16' : isLogin ? '' : 'pl-16 xl:pl-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
