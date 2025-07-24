import React, { useState } from 'react';
import { useBudgetRequests } from '../../hooks/useBudgetRequests';
import { BudgetRequestForm } from './BudgetRequestForm';
import { BudgetRequestCard } from './BudgetRequestCard';
import { BudgetRequestDetails } from './BudgetRequestDetails';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Plus, Search, Filter } from 'lucide-react';
import { BudgetRequest } from '../../lib/supabase';

export function BudgetRequests() {
  const { requests, loading, error, fetchRequests, deleteRequest } = useBudgetRequests();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.request_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.account_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteRequest = async (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบคำขอ ${request.request_no}?`)) {
      try {
        await deleteRequest(requestId);
        alert('ลบคำขอสำเร็จ');
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบคำขอ');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8">
        <p>เกิดข้อผิดพลาด: {error}</p>
        <Button onClick={fetchRequests} className="mt-4">
          ลองใหม่
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">การขอใช้งบประมาณ</h2>
          <p className="text-white/60">จัดการคำขอใช้งบประมาณและติดตามสถานะการอนุมัติ</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>สร้างคำขอใหม่</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาเลขที่คำขอ, ผู้ขอ หรือรหัสบัญชี..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">สถานะทั้งหมด</option>
              <option value="PENDING">รอการอนุมัติ</option>
              <option value="APPROVED">อนุมัติแล้ว</option>
              <option value="REJECTED">ปฏิเสธ</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map(request => (
          <BudgetRequestCard
            key={request.id}
            request={request}
            onView={setSelectedRequest}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-white/60 text-lg">
            {searchTerm || statusFilter ? 'ไม่พบคำขอที่ตรงกับเงื่อนไขการค้นหา' : 'ยังไม่มีคำขอในระบบ'}
          </p>
          {!searchTerm && !statusFilter && (
            <Button
              onClick={() => setIsFormOpen(true)}
              className="mt-4"
            >
              สร้างคำขอรายการแรก
            </Button>
          )}
        </Card>
      )}

      {/* Budget Request Form Modal */}
      <BudgetRequestForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchRequests();
        }}
      />

      {/* Budget Request Details Modal */}
      <BudgetRequestDetails
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />
    </div>
  );
}