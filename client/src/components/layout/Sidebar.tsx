import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS } from '@/lib/constants';
import { useAuth } from '@/hooks/use-auth';
//import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Avatar from 'react-avatar';
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

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  isMobileMenuOpen: boolean;
  onClick?: () => void;
};

const NavItem = ({ to, icon: Icon, label, isActive, isMobileMenuOpen, onClick }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
    )}
    onClick={onClick}
  >
    <Icon size={20} />
    <span className={cn("transition-opacity", 
      isMobileMenuOpen ? "opacity-100" : "opacity-0 md:opacity-100"
    )}>
      {label}
    </span>
  </Link>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  if (!user) return null;

  return (
    <aside className="w-64 bg-[hsl(222,47%,11%)] shadow-md flex flex-col h-screen fixed left-0">
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center mb-8">
          <i className="fas fa-bug text-xl mr-2 text-primary"></i>
          <span className="text-2xl font-bold text-sidebar-foreground">IssueTrack</span>
        </div>

        <nav className="flex-grow">
          {/*<div className="space-y-2">
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
          </div>*/}
          <NavItem 
            to="/" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            isActive={isActive('/')} 
            isMobileMenuOpen={isMobileMenuOpen}
            onClick={closeMobileMenu}
          />
          <NavItem 
            to="/issues" 
            icon={ListTodo} 
            label="Issues" 
            isActive={isActive('/issues') || isActive('/issues/new') || location.pathname.includes('/issues/')} 
            isMobileMenuOpen={isMobileMenuOpen}
            onClick={closeMobileMenu}
          />
          <NavItem 
            to="/analytics" 
            icon={BarChart3} 
            label="Analytics" 
            isActive={isActive('/analytics')} 
            isMobileMenuOpen={isMobileMenuOpen}
            onClick={closeMobileMenu}
          />
          <NavItem 
            to="/settings" 
            icon={Settings} 
            label="Settings" 
            isActive={isActive('/settings')} 
            isMobileMenuOpen={isMobileMenuOpen}
            onClick={closeMobileMenu}
          />
        </nav>

        <div className="mt-auto">
          <Button 
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
          <div className="flex items-center justify-between mt-4 p-2 rounded-md bg-sidebar-accent/50">
            <div className="flex items-center gap-3">
              {/*<Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{user.fullName}</AvatarFallback>
              </Avatar>*/}
              {user && (
                <Link to="/profile">
                  <Avatar name={user.fullName} size="40" round={true} />
                </Link>
              )}
              <div className={cn(
                "transition-opacity",
                isMobileMenuOpen ? "opacity-100" : "opacity-0 md:opacity-100"
              )}>
                <p className="text-sm font-medium text-sidebar-foreground">{user.fullName}</p>
                <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;