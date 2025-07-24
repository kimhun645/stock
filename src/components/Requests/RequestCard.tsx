import React from 'react';
import { MaterialRequest } from '../../types';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  Calendar,
  Package,
  Eye
} from 'lucide-react';

interface RequestCardProps {
  request: MaterialRequest;
  onView: (request: MaterialRequest) => void;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  showActions?: boolean;
}

export function RequestCard({ request, onView, onApprove, onReject, showActions = false }: RequestCardProps) {
  const getStatusIcon = () => {
    switch (request.status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'partially_approved':
        return <AlertCircle className="w-5 h-5 text-orange-400" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (request.status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'partially_approved':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getUrgencyColor = () => {
    switch (request.urgencyLevel) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="p-6 hover:scale-105 transition-transform duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{request.requestNumber}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <User className="w-4 h-4 text-white/60" />
              <span className="text-white/80 text-sm">{request.requester.name}</span>
              <span className="text-white/60">•</span>
            {request.urgencyLevel === 'low' ? 'ต่ำ' : 
             request.urgencyLevel === 'medium' ? 'ปานกลาง' :
             request.urgencyLevel === 'high' ? 'สูง' : 'เร่งด่วน'}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs border ${getUrgencyColor()}`}>
              {request.status === 'pending' ? 'รอดำเนินการ' :
               request.status === 'approved' ? 'อนุมัติแล้ว' :
               request.status === 'rejected' ? 'ปฏิเสธ' :
               request.status === 'completed' ? 'เสร็จสิ้น' : 'อนุมัติบางส่วน'}
            </span>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor()}`}>
                {request.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Request Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-white/60 text-xs">วันที่ขอ</p>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-white/60" />
              <span className="text-white text-sm">
                {request.requestDate.toLocaleDateString()}
              </span>
            </div>
          </div>
          <div>
            <p className="text-white/60 text-xs">รายการทั้งหมด</p>
            <div className="flex items-center space-x-1">
              <Package className="w-4 h-4 text-white/60" />
              <span className="text-white text-sm">{request.items.length}</span>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div>
          <p className="text-white/60 text-xs">เหตุผล</p>
          <p className="text-white/80 text-sm">{request.reason}</p>
        </div>

        {/* Items Preview */}
        <div>
          <p className="text-white/60 text-xs mb-2">รายการ</p>
          <div className="space-y-1">
            {request.items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-white/80">{item.material.name}</span>
                <span className="text-white/60">
                  {item.requestedQuantity} {item.material.unit}
                </span>
              </div>
            ))}
            {request.items.length > 3 && (
              <p className="text-white/60 text-xs">
                +{request.items.length - 3} รายการเพิ่มเติม
              </p>
            )}
          </div>
        </div>

        {/* Total Value */}
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <span className="text-white/60 text-sm">มูลค่ารวม</span>
          <span className="text-white font-semibold">₿{request.totalValue.toLocaleString()}</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onView(request)}
            className="flex items-center space-x-1 flex-1"
          >
            <Eye className="w-4 h-4" />
            <span>ดูรายละเอียด</span>
          </Button>
          
          {showActions && request.status === 'pending' && (
            <>
              {onApprove && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => onApprove(request.id)}
                  className="flex-1"
                >
                  อนุมัติ
                </Button>
              )}
              {onReject && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onReject(request.id)}
                  className="flex-1"
                >
                  ปฏิเสธ
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}