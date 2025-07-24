import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface HeaderProps {
  onSidebarToggle: () => void;
  title: string;
}

export function Header({ onSidebarToggle, title }: HeaderProps) {
  const { state } = useApp();
  const unreadNotifications = state.notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <Bell className="w-5 h-5 text-white" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <img
            src={state.currentUser?.avatar || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1"}
            alt="User"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
          />
        </div>
      </div>
    </header>
  );
}