import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Package,
  Users,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

export function Reports() {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportTypes = [
    { id: 'overview', name: 'Overview Report', icon: BarChart3 },
    { id: 'materials', name: 'Materials Report', icon: Package },
    { id: 'requests', name: 'Requests Report', icon: ShoppingCart },
    { id: 'users', name: 'Users Report', icon: Users },
    { id: 'financial', name: 'Financial Report', icon: DollarSign }
  ];

  const periods = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' }
  ];

  const generateReport = () => {
    // Mock report generation
    alert(`Generating ${reportTypes.find(r => r.id === selectedReport)?.name} for ${periods.find(p => p.id === selectedPeriod)?.name}`);
  };

  const exportReport = (format: string) => {
    alert(`Exporting report as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">รายงานและการวิเคราะห์</h2>
          <p className="text-white/60">สร้างรายงานและวิเคราะห์ข้อมูลการใช้วัสดุ</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => exportReport('pdf')}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก PDF</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => exportReport('excel')}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก Excel</span>
          </Button>
        </div>
      </div>

      {/* Report Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">การตั้งค่ารายงาน</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">ประเภทรายงาน</label>
            <div className="space-y-2">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedReport(type.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      selectedReport === type.id
                        ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                        : 'bg-white/5 hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Period */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">ช่วงเวลา</label>
            <div className="space-y-2">
              {periods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    selectedPeriod === period.id
                      ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                      : 'bg-white/5 hover:bg-white/10 text-white/80'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>{period.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={generateReport} className="w-full">
            สร้างรายงาน
          </Button>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Requests</p>
              <p className="text-2xl font-bold text-white">{state.dashboardStats.totalRequests}</p>
              <div className="flex items-center mt-1 text-green-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+12%</span>
              </div>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Materials</p>
              <p className="text-2xl font-bold text-white">{state.materials.length}</p>
              <div className="flex items-center mt-1 text-green-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+5%</span>
              </div>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Package className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{state.users.filter(u => u.isActive).length}</p>
              <div className="flex items-center mt-1 text-green-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+8%</span>
              </div>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-white">₿{state.dashboardStats.totalValue.toLocaleString()}</p>
              <div className="flex items-center mt-1 text-green-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>+15%</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Request Trend</h3>
          <div className="space-y-3">
            {state.dashboardStats.monthlyTrend.map((month) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-white/70">{month.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                      style={{ width: `${(month.requests / 30) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-medium w-8 text-right">{month.requests}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Material Categories</h3>
          <div className="space-y-3">
            {Array.from(new Set(state.materials.map(m => m.category))).map((category) => {
              const count = state.materials.filter(m => m.category === category).length;
              const percentage = (count / state.materials.length) * 100;
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-white/70">{category}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-white font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white/80">New material request submitted by John Doe</span>
            <span className="text-white/60 text-sm ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-white/80">Material stock updated for A4 Paper</span>
            <span className="text-white/60 text-sm ml-auto">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-white/80">Request REQ-001 approved by manager</span>
            <span className="text-white/60 text-sm ml-auto">6 hours ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
}