import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { NAV_ITEMS } from '@/lib/constants';
import { Notification } from '@shared/schema';
import { formatDateTime } from '@/lib/utils';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
    staleTime: 30000, // 30 seconds
  });

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      // Invalidate notifications query to refresh
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <header className="z-30">
      <div className="bg-primary text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-full hover:bg-primary-dark md:hidden"
            >
              <i className="fas fa-bars"></i>
            </button>
            <Link href="/" className="flex items-center">
              <i className="fas fa-bug text-xl mr-2"></i>
              <span className="text-xl font-medium">IssueTrack</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="relative mr-2">
              <button 
                onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                className="p-2 rounded-full hover:bg-primary-dark"
              >
                <i className="fas fa-bell"></i>
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-secondary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>
              
              {notificationMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 font-medium">
                    Notifications
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <a 
                          href="#" 
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-all"
                        >
                          <div className="flex">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-3 ${
                              notification.type === 'comment' ? 'bg-primary-light' : 
                              notification.type === 'status' ? 'bg-success-light' : 
                              'bg-warning-light'
                            }`}>
                              <i className={`fas ${
                                notification.type === 'comment' ? 'fa-comment-dots' : 
                                notification.type === 'status' ? 'fa-check-circle' : 
                                'fa-user-plus'
                              }`}></i>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDateTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                  <a href="#" className="block px-4 py-2 text-sm text-center text-primary border-t border-gray-100">
                    View all notifications
                  </a>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center hover:bg-primary-dark px-3 py-2 rounded-md"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                  <span className="text-sm font-medium">
                    {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'JD'}
                  </span>
                </div>
                <span className="hidden md:inline mr-1">{user?.fullName || 'John Doe'}</span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i className="fas fa-user mr-2"></i> Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i className="fas fa-cog mr-2"></i> Settings
                  </a>
                  <div className="border-t border-gray-100"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <nav className="bg-primary-dark text-white overflow-x-auto">
          <div className="flex">
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`px-4 py-3 text-sm font-medium flex items-center whitespace-nowrap ${
                  (item.path === '/' && location === '/') || 
                  (item.path !== '/' && location.startsWith(item.path))
                    ? 'border-b-2 border-secondary'
                    : 'border-b-2 border-transparent hover:border-white/50'
                }`}
              >
                <i className={`fas fa-${item.icon} mr-2`}></i> {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
