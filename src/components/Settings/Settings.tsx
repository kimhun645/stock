import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';

export function Settings() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'โปรไฟล์', icon: User },
    { id: 'notifications', name: 'การแจ้งเตือน', icon: Bell },
    { id: 'security', name: 'ความปลอดภัย', icon: Shield },
    { id: 'system', name: 'ระบบ', icon: Database },
    { id: 'appearance', name: 'รูปแบบ', icon: Palette },
    { id: 'general', name: 'ทั่วไป', icon: Globe }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={state.currentUser?.avatar || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{state.currentUser?.name}</h3>
                <p className="text-white/60">{state.currentUser?.email}</p>
                <p className="text-white/60 text-sm">{state.currentUser?.department} • {state.currentUser?.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={state.currentUser?.name}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={state.currentUser?.email}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Department</label>
                <input
                  type="text"
                  defaultValue={state.currentUser?.department}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { name: 'Email Notifications', desc: 'Receive notifications via email' },
                { name: 'Push Notifications', desc: 'Receive browser push notifications' },
                { name: 'Request Updates', desc: 'Get notified about request status changes' },
                { name: 'Low Stock Alerts', desc: 'Get alerted when materials are running low' },
                { name: 'Weekly Reports', desc: 'Receive weekly summary reports' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{item.name}</h4>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={index < 3}
                    className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Security Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h4 className="text-white font-medium mb-4">Two-Factor Authentication</h4>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white">Enable 2FA</p>
                  <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
                </div>
                <Button variant="secondary" size="sm">Enable</Button>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">System Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Default Currency</label>
                <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="btc">Bitcoin (₿)</option>
                  <option value="usd">US Dollar ($)</option>
                  <option value="eur">Euro (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Date Format</label>
                <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Time Zone</label>
                <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="utc+7">UTC+7 (Bangkok)</option>
                  <option value="utc+0">UTC+0 (London)</option>
                  <option value="utc-5">UTC-5 (New York)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Language</label>
                <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="th">ไทย</option>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h4 className="text-white font-medium mb-4">Data Management</h4>
              <div className="flex space-x-3">
                <Button variant="secondary" className="flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>Backup Data</span>
                </Button>
                <Button variant="warning" className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset System</span>
                </Button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Appearance Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Dark', 'Light', 'Auto'].map((theme) => (
                    <button
                      key={theme}
                      className={`p-4 rounded-lg border transition-colors ${
                        theme === 'Dark'
                          ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                          : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">Accent Color</label>
                <div className="flex space-x-3">
                  {['blue', 'purple', 'green', 'orange', 'red'].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full bg-${color}-500 ${
                        color === 'blue' ? 'ring-2 ring-white/50' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Compact Mode</h4>
                  <p className="text-white/60 text-sm">Use smaller spacing and components</p>
                </div>
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'general':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Organization Name</label>
                <input
                  type="text"
                  defaultValue="MaterialFlow Corp"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Contact Email</label>
                <input
                  type="email"
                  defaultValue="admin@materialflow.com"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Support Phone</label>
                <input
                  type="tel"
                  defaultValue="+66 2 123 4567"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="border-t border-white/10 pt-6">
                <h4 className="text-white font-medium mb-4">System Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60">Version</p>
                    <p className="text-white">v2.1.0</p>
                  </div>
                  <div>
                    <p className="text-white/60">Last Updated</p>
                    <p className="text-white">2024-01-15</p>
                  </div>
                  <div>
                    <p className="text-white/60">Database</p>
                    <p className="text-white">Connected</p>
                  </div>
                  <div>
                    <p className="text-white/60">Storage</p>
                    <p className="text-white">85% Used</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">ตั้งค่าระบบ</h2>
        <p className="text-white/60">จัดการบัญชีผู้ใช้และการตั้งค่าระบบ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="p-4 lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Content */}
        <Card className="p-6 lg:col-span-3">
          {renderTabContent()}
          
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-white/10">
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary" className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}