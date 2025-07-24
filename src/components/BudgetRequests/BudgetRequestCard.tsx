import React from 'react';
import { BudgetRequest } from '../../lib/supabase';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  Calendar, 
  User, 
  CreditCard, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react';

interface BudgetRequestCardProps {
  request: BudgetRequest;
  onView: (request: BudgetRequest) => void;
  onDelete?: (requestId: string) => void;
}

export function BudgetRequestCard({ request, onView, onDelete }: BudgetRequestCardProps) {
  const getStatusIcon = () => {
    switch (request.status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (request.status) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'APPROVED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = () => {
    switch (request.status) {
      case 'PENDING':
        return 'รอการอนุมัติ';
      case 'APPROVED':
        return 'อนุมัติแล้ว';
      case 'REJECTED':
        return 'ปฏิเสธ';
      default:
        return 'ไม่ทราบสถานะ';
    }
  };

  return (
    <Card className="p-6 hover:scale-105 transition-transform duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{request.request_no}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <User className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm">{request.requester}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Request Info */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <p className="text-white/60 text-xs">วันที่ขอ</p>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-white/60" />
              <span className="text-white text-sm">
                {new Date(request.request_date).toLocaleDateString('th-TH')}
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-white/60 text-xs">รหัสบัญชี</p>
            <div className="flex items-center space-x-1">
              <CreditCard className="w-4 h-4 text-white/60" />
              <span className="text-white text-sm">{request.account_code}</span>
            </div>
          </div>

          <div>
            <p className="text-white/60 text-xs">ชื่อบัญชี</p>
            <p className="text-white/80 text-sm">{request.account_name}</p>
          </div>
        </div>

        {/* Amount */}
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <span className="text-white/60 text-sm">จำนวนเงิน</span>
          <span className="text-white font-semibold text-lg">
            {request.amount.toLocaleString()} บาท
          </span>
        </div>

        {/* Actions */}
        <div className="pt-2 space-y-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onView(request)}
            className="flex items-center space-x-1 w-full justify-center"
          >
            <Eye className="w-4 h-4" />
            <span>ดูรายละเอียด</span>
          </Button>
          
          {/* แสดงปุ่มลบเฉพาะคำขอที่ยังไม่อนุมัติ */}
          {request.status === 'PENDING' && onDelete && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(request.id)}
              className="flex items-center space-x-1 w-full justify-center"
            >
              <Trash2 className="w-4 h-4" />
              <span>ลบคำขอ</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}