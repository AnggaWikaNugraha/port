import Navbar from '../../components/navbar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <div className='pt-7 min-h-screen flex flex-col'>{children}</div>
    </div>
  );
};

export default MainLayout;