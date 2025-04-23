import { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex-grow flex">
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-grow overflow-auto p-4 md:p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
