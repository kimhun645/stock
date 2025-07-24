import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { StatsCard } from './StatsCard';
import { Card } from '../UI/Card';
import { 
  ShoppingCart, 
  Package, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export function Dashboard() {
  const { state } = useApp();
  const { dashboardStats, materials } = state;

  const lowStockMaterials = materials.filter(m => m.stockQuantity <= m.minStockLevel);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="คำขอทั้งหมด"
          value={dashboardStats.totalRequests}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="รอการอนุมัติ"
          value={dashboardStats.pendingRequests}
          icon={<Clock className="w-6 h-6 text-white" />}
          trend={{ value: 5, isPositive: false }}
          color="yellow"
        />
        <StatsCard
          title="เสร็จสิ้นแล้ว"
          value={dashboardStats.completedRequests}
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          trend={{ value: 8, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="มูลค่ารวม"
          value={`₿${dashboardStats.totalValue.toLocaleString()}`}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          trend={{ value: 15, isPositive: true }}
          color="purple"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">แนวโน้มคำขอรายเดือน</h3>
          <div className="space-y-3">
            {dashboardStats.monthlyTrend.map((month) => (
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

        {/* Low Stock Alert */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-white">แจ้งเตือนวัสดุใกล้หมด</h3>
          </div>
          <div className="space-y-3">
            {lowStockMaterials.length > 0 ? (
              lowStockMaterials.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{material.name}</p>
                    <p className="text-white/60 text-sm">{material.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-medium">{material.stockQuantity} {material.unit}</p>
                    <p className="text-white/60 text-sm">Min: {material.minStockLevel}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60 text-center py-4">วัสดุทั้งหมดมีสต็อกเพียงพอ!</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">คำขอวัสดุล่าสุด</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-white/70 text-sm">
                <th className="text-left py-2">รหัสคำขอ</th>
                <th className="text-left py-2">ผู้ขอ</th>
                <th className="text-left py-2">แผนก</th>
                <th className="text-left py-2">สถานะ</th>
                <th className="text-left py-2">วันที่</th>
                <th className="text-left py-2">มูลค่า</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {/* Mock recent requests */}
              <tr className="border-t border-white/10">
                <td className="py-3">REQ-001</td>
                <td className="py-3">สมชาย ใจดี</td>
                <td className="py-3">ไอที</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                    รอดำเนินการ
                  </span>
                </td>
                <td className="py-3">2024-01-15</td>
                <td className="py-3">₿45,000</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-3">REQ-002</td>
                <td className="py-3">สุดา สวยงาม</td>
                <td className="py-3">ทรัพยากรบุคคล</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    อนุมัติแล้ว
                  </span>
                </td>
                <td className="py-3">2024-01-14</td>
                <td className="py-3">₿12,500</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-3">REQ-003</td>
                <td className="py-3">วิชัย รวยเงิน</td>
                <td className="py-3">การเงิน</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                    เสร็จสิ้น
                  </span>
                </td>
                <td className="py-3">2024-01-13</td>
                <td className="py-3">₿8,200</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}