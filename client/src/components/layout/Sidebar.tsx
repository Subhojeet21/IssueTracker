import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ListTodo, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  PlusCircle
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <aside className="w-64 bg-[hsl(222,47%,11%)] shadow-md flex flex-col h-screen fixed left-0">
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
                  <i className={`fas fa-${LayoutDashboard} w-5`}></i>
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
            <LogOut size={20} className="mr-3" />
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </Button>
          <div className="flex items-center justify-between mt-4 p-2 rounded-md bg-sidebar-accent/50">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className={cn(
                "transition-opacity",
                isMobileMenuOpen ? "opacity-100" : "opacity-0 md:opacity-100"
              )}>
                <p className="text-sm font-medium text-sidebar-foreground">John Doe</p>
                <p className="text-xs text-sidebar-foreground/70">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;