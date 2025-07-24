import React from 'react';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  Bell
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isCollapsed: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'แดชบอร์ด', icon: Home },
  { id: 'materials', label: 'จัดการวัสดุ', icon: Package },
  { id: 'requests', label: 'คำขอเบิกวัสดุ', icon: ShoppingCart },
  { id: 'users', label: 'จัดการผู้ใช้', icon: Users },
  { id: 'reports', label: 'รายงาน', icon: BarChart3 },
  { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
  { id: 'settings', label: 'ตั้งค่า', icon: Settings }
];

export function Sidebar({ activeView, onViewChange, isCollapsed }: SidebarProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-lg border-r border-white/20 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } h-full flex flex-col`}>
      {/* Logo */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-white">ระบบเบิกวัสดุ</h1>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-center space-x-3">
          <img
            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">จอห์น โด</p>
              <p className="text-xs text-white/70 truncate">ผู้จัดการ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}