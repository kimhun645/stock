import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useNotification } from '../../hooks/useNotification';
import { MaterialRequest } from '../../types';
import { RequestCard } from './RequestCard';
import { RequestForm } from './RequestForm';
import { RequestDetails } from './RequestDetails';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Plus, Search, Filter } from 'lucide-react';

export function Requests() {
  const { state, dispatch } = useApp();
  const { addNotification } = useNotification();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');

  const filteredRequests = state.requests.filter(request => {
    const matchesSearch = request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesUrgency = !urgencyFilter || request.urgencyLevel === urgencyFilter;
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const handleCreateRequest = (requestData: Omit<MaterialRequest, 'id' | 'requestNumber' | 'requestDate' | 'status' | 'approvals' | 'totalValue'>) => {
    const totalValue = requestData.items.reduce(
      (sum, item) => sum + (item.requestedQuantity * item.material.pricePerUnit),
      0
    );

    const newRequest: MaterialRequest = {
      ...requestData,
      id: Date.now().toString(),
      requestNumber: `REQ-${String(Date.now()).slice(-6)}`,
      requestDate: new Date(),
      status: 'pending',
      approvals: [],
      totalValue
    };

    dispatch({ type: 'ADD_REQUEST', payload: newRequest });
    addNotification({
      userId: state.currentUser?.id || '',
      title: 'Request Submitted',
      message: `Request ${newRequest.requestNumber} has been submitted for approval`,
      type: 'success'
    });
  };

  const handleApproveRequest = (requestId: string) => {
    const request = state.requests.find(r => r.id === requestId);
    if (!request) return;

    const updatedRequest: MaterialRequest = {
      ...request,
      status: 'approved'
    };

    dispatch({ type: 'UPDATE_REQUEST', payload: updatedRequest });
    addNotification({
      userId: state.currentUser?.id || '',
      title: 'Request Approved',
      message: `Request ${request.requestNumber} has been approved`,
      type: 'success'
    });
  };

  const handleRejectRequest = (requestId: string) => {
    const request = state.requests.find(r => r.id === requestId);
    if (!request) return;

    const updatedRequest: MaterialRequest = {
      ...request,
      status: 'rejected'
    };

    dispatch({ type: 'UPDATE_REQUEST', payload: updatedRequest });
    addNotification({
      userId: state.currentUser?.id || '',
      title: 'Request Rejected',
      message: `Request ${request.requestNumber} has been rejected`,
      type: 'warning'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">คำขอเบิกวัสดุ</h2>
          <p className="text-white/60">ส่งคำขอใหม่และติดตามสถานะคำขอเบิกวัสดุ</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>คำขอใหม่</span>
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
              placeholder="ค้นหาเลขที่คำขอ, ชื่อผู้ขอ หรือแผนก..."
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
              <option value="pending">รอดำเนินการ</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="rejected">ปฏิเสธ</option>
              <option value="completed">เสร็จสิ้น</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="relative">
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">ความเร่งด่วนทั้งหมด</option>
              <option value="low">ต่ำ</option>
              <option value="medium">ปานกลาง</option>
              <option value="high">สูง</option>
              <option value="urgent">เร่งด่วน</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map(request => (
          <RequestCard
            key={request.id}
            request={request}
            onView={setSelectedRequest}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            showActions={state.currentUser?.role === 'manager' || state.currentUser?.role === 'admin'}
          />
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-white/60 text-lg">
            {searchTerm || statusFilter || urgencyFilter ? 'ไม่พบคำขอที่ตรงกับเงื่อนไขการค้นหา' : 'ยังไม่มีคำขอในระบบ'}
          </p>
          {!searchTerm && !statusFilter && !urgencyFilter && (
            <Button
              onClick={() => setIsFormOpen(true)}
              className="mt-4"
            >
              ส่งคำขอรายการแรก
            </Button>
          )}
        </Card>
      )}

      {/* Request Form Modal */}
      <RequestForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateRequest}
      />

      {/* Request Details Modal */}
      <RequestDetails
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        showActions={state.currentUser?.role === 'manager' || state.currentUser?.role === 'admin'}
      />
    </div>
  );
}