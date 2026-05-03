import Navbar from '../../components/navbar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen bg-gray-950 text-white'>
      <Navbar />
      <div className='pt-16 min-h-screen flex flex-col'>{children}</div>
    </div>
  );
};

export default MainLayout;