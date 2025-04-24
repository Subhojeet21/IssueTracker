import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col h-screen fixed left-0">
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-8">
          <i className="fas fa-bug text-xl mr-2 text-primary"></i>
          <span className="text-xl font-medium">IssueTrack</span>
        </div>

        <nav className="flex-grow">
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
              >
                <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  <i className={`fas fa-${item.icon} w-5`}></i>
                  <span className="ml-3">{item.label}</span>
                </a>
              </Link>
            ))}
          </div>
        </nav>

        <div className="mt-auto">
          <Button 
            onClick={logout}
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;