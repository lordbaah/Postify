import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    // min-h-screen helps to let footer always be at the button
    <div className="flex flex-col min-h-screen font-roboto antialiased text-gray-800 bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
