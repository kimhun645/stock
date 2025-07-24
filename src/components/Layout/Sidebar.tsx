import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard,
  Users, 
  BarChart3, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isCollapsed: boolean;
}

export function Sidebar({ activeView, onViewChange, isCollapsed }: SidebarProps) {
  const { state } = useApp();
  const unreadNotifications = state.notifications.filter(n => !n.isRead).length;

  const menuItems = [
    { id: 'dashboard', name: 'หน้าหลัก', icon: LayoutDashboard },
    { id: 'materials', name: 'จัดการวัสดุ', icon: Package },
    { id: 'requests', name: 'คำขอเบิกวัสดุ', icon: ShoppingCart },
    { id: 'budget-requests', name: 'การขอใช้งบประมาณ', icon: CreditCard },
    { id: 'users', name: 'จัดการผู้ใช้', icon: Users },
    { id: 'reports', name: 'รายงาน', icon: BarChart3 },
    { id: 'notifications', name: 'การแจ้งเตือน', icon: Bell, badge: unreadNotifications },
    { id: 'settings', name: 'ตั้งค่าระบบ', icon: Settings }
  ];

  return (
    <div className={`bg-white/10 backdrop-blur-lg border-r border-white/20 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">MaterialFlow</h1>
              <p className="text-white/60 text-sm">ระบบเบิกวัสดุ</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <div className="flex items-center space-x-3">
            <img
              src={state.currentUser?.avatar || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1"}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{state.currentUser?.name}</p>
              <p className="text-white/60 text-xs">{state.currentUser?.department}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}