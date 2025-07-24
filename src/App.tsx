import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Materials } from './components/Materials/Materials';
import { Requests } from './components/Requests/Requests';
import { Users } from './components/Users/Users';
import { Reports } from './components/Reports/Reports';
import { Notifications } from './components/Notifications/Notifications';
import { Settings } from './components/Settings/Settings';
import { BudgetRequests } from './components/BudgetRequests/BudgetRequests';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'หน้าหลัก';
      case 'materials': return 'จัดการวัสดุ';
      case 'requests': return 'คำขอเบิกวัสดุ';
      case 'budget-requests': return 'การขอใช้งบประมาณ';
      case 'users': return 'จัดการผู้ใช้';
      case 'reports': return 'รายงาน';
      case 'notifications': return 'การแจ้งเตือน';
      case 'settings': return 'ตั้งค่าระบบ';
      default: return 'หน้าหลัก';
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'materials':
        return <Materials />;
      case 'requests':
        return <Requests />;
      case 'budget-requests':
        return <BudgetRequests />;
      case 'users':
        return <Users />;
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar
            activeView={currentView}
            onViewChange={setCurrentView}
            isCollapsed={sidebarCollapsed}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header
              onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={getViewTitle()}
            />

            {/* Content */}
            <main className="flex-1 overflow-auto p-6">
              {renderCurrentView()}
            </main>
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;