import React from 'react';
import { MaterialRequest } from '../../types';
import { Modal } from '../UI/Modal';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  User, 
  Calendar, 
  Package, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText
} from 'lucide-react';

interface RequestDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  request: MaterialRequest | null;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  showActions?: boolean;
}

export function RequestDetails({ 
  isOpen, 
  onClose, 
  request, 
  onApprove, 
  onReject, 
  showActions = false 
}: RequestDetailsProps) {
  if (!request) return null;

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Details" size="xl">
      <div className="space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">{request.requestNumber}</h2>
              <div className="flex items-center space-x-2 mt-2">
                {getStatusIcon()}
                <span className="text-white/80 capitalize">{request.status.replace('_', ' ')}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-white">₿{request.totalValue.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <User className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm">Requester</span>
              </div>
              <p className="text-white font-medium">{request.requester.name}</p>
              <p className="text-white/60 text-sm">{request.department}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm">Request Date</span>
              </div>
              <p className="text-white">{request.requestDate.toLocaleDateString()}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <AlertCircle className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm">Urgency</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                request.urgencyLevel === 'urgent' ? 'bg-red-500/20 text-red-400' :
                request.urgencyLevel === 'high' ? 'bg-orange-500/20 text-orange-400' :
                request.urgencyLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {request.urgencyLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </Card>

        {/* Reason */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-5 h-5 text-white/60" />
            <h3 className="text-lg font-semibold text-white">Request Reason</h3>
          </div>
          <p className="text-white/80">{request.reason}</p>
          {request.notes && (
            <div className="mt-4">
              <h4 className="text-white/60 text-sm mb-2">Additional Notes</h4>
              <p className="text-white/80">{request.notes}</p>
            </div>
          )}
        </Card>

        {/* Items */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Package className="w-5 h-5 text-white/60" />
            <h3 className="text-lg font-semibold text-white">Requested Items</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-white/70 text-sm border-b border-white/10">
                  <th className="text-left py-2">Material</th>
                  <th className="text-left py-2">Category</th>
                  <th className="text-right py-2">Requested</th>
                  <th className="text-right py-2">Unit Price</th>
                  <th className="text-right py-2">Total</th>
                  {request.status !== 'pending' && <th className="text-right py-2">Approved</th>}
                </tr>
              </thead>
              <tbody className="text-white">
                {request.items.map((item, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{item.material.name}</p>
                        <p className="text-white/60 text-sm">{item.material.description}</p>
                      </div>
                    </td>
                    <td className="py-3 text-white/80">{item.material.category}</td>
                    <td className="py-3 text-right">
                      {item.requestedQuantity} {item.material.unit}
                    </td>
                    <td className="py-3 text-right">₿{item.material.pricePerUnit}</td>
                    <td className="py-3 text-right font-medium">
                      ₿{(item.requestedQuantity * item.material.pricePerUnit).toLocaleString()}
                    </td>
                    {request.status !== 'pending' && (
                      <td className="py-3 text-right">
                        {item.approvedQuantity !== undefined ? (
                          <span className={item.approvedQuantity === item.requestedQuantity ? 'text-green-400' : 'text-orange-400'}>
                            {item.approvedQuantity} {item.material.unit}
                          </span>
                        ) : (
                          <span className="text-white/60">-</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Approval History */}
        {request.approvals.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Approval History</h3>
            <div className="space-y-3">
              {request.approvals.map((approval, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{approval.approver.name}</p>
                    <p className="text-white/60 text-sm">Level {approval.level} Approver</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {approval.status === 'approved' && <CheckCircle className="w-4 h-4 text-green-400" />}
                      {approval.status === 'rejected' && <XCircle className="w-4 h-4 text-red-400" />}
                      {approval.status === 'pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                      <span className={`text-sm capitalize ${
                        approval.status === 'approved' ? 'text-green-400' :
                        approval.status === 'rejected' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {approval.status}
                      </span>
                    </div>
                    {approval.approvedDate && (
                      <p className="text-white/60 text-xs">
                        {approval.approvedDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        {showActions && request.status === 'pending' && (
          <div className="flex space-x-3">
            {onApprove && (
              <Button
                variant="success"
                onClick={() => onApprove(request.id)}
                className="flex-1"
              >
                Approve Request
              </Button>
            )}
            {onReject && (
              <Button
                variant="danger"
                onClick={() => onReject(request.id)}
                className="flex-1"
              >
                Reject Request
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}