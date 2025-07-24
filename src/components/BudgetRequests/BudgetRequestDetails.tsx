import React, { useState, useEffect } from 'react';
import { BudgetRequest, Approval } from '../../lib/supabase';
import { BudgetService } from '../../services/budgetService';
import { Modal } from '../UI/Modal';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  User, 
  Calendar, 
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Printer
} from 'lucide-react';

interface BudgetRequestDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  request: BudgetRequest | null;
}

export function BudgetRequestDetails({ isOpen, onClose, request }: BudgetRequestDetailsProps) {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (request && isOpen) {
      fetchApprovals();
    }
  }, [request, isOpen]);

  const fetchApprovals = async () => {
    if (!request) return;
    
    try {
      setLoading(true);
      const approvalsData = await BudgetService.getApprovals(request.id);
      setApprovals(approvalsData);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!request) return null;

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

  const materialList = request.material_list as Array<{ item: string; quantity: number }> || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="รายละเอียดคำขอใช้งบประมาณ" size="xl">
      <div className="space-y-6 print:space-y-4">
        {/* Header - Print Friendly */}
        <div className="print:text-black">
          <Card className="p-6 print:shadow-none print:border print:border-gray-300">
            <div className="flex items-start justify-between mb-4 print:mb-2">
              <div>
                <h2 className="text-xl font-bold text-white print:text-black">
                  คำขอใช้งบประมาณ
                </h2>
                <p className="text-lg font-semibold text-white print:text-black mt-1">
                  เลขที่: {request.request_no}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-white print:text-black font-medium">
                  สถานะ: {getStatusText()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <User className="w-4 h-4 text-white/60 print:text-gray-600" />
                  <span className="text-white/60 print:text-gray-600 text-sm">ผู้ขอ</span>
                </div>
                <p className="text-white print:text-black font-medium">{request.requester}</p>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="w-4 h-4 text-white/60 print:text-gray-600" />
                  <span className="text-white/60 print:text-gray-600 text-sm">วันที่ขอ</span>
                </div>
                <p className="text-white print:text-black">
                  {new Date(request.request_date).toLocaleDateString('th-TH')}
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <CreditCard className="w-4 h-4 text-white/60 print:text-gray-600" />
                  <span className="text-white/60 print:text-gray-600 text-sm">รหัสบัญชี</span>
                </div>
                <p className="text-white print:text-black font-medium">{request.account_code}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-white/60 print:text-gray-600 text-sm">จำนวนเงิน</span>
                </div>
                <p className="text-white print:text-black font-bold text-lg">
                  {request.amount.toLocaleString()} บาท
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-white/60 print:text-gray-600 text-sm mb-1">ชื่อบัญชี</p>
                <p className="text-white print:text-black">{request.account_name}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* รายการที่ขอ */}
        <Card className="p-6 print:shadow-none print:border print:border-gray-300">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-white/60 print:text-gray-600" />
            <h3 className="text-lg font-semibold text-white print:text-black">รายการที่ขอ</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full print:text-black">
              <thead>
                <tr className="text-white/70 print:text-gray-700 text-sm border-b border-white/10 print:border-gray-300">
                  <th className="text-left py-2">ลำดับ</th>
                  <th className="text-left py-2">รายการ</th>
                  <th className="text-right py-2">จำนวน</th>
                </tr>
              </thead>
              <tbody className="text-white print:text-black">
                {materialList.map((item, index) => (
                  <tr key={index} className="border-b border-white/5 print:border-gray-200">
                    <td className="py-3">{index + 1}</td>
                    <td className="py-3">{item.item}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* หมายเหตุ */}
        {request.note && (
          <Card className="p-6 print:shadow-none print:border print:border-gray-300">
            <h3 className="text-lg font-semibold text-white print:text-black mb-3">หมายเหตุ</h3>
            <p className="text-white/80 print:text-black">{request.note}</p>
          </Card>
        )}

        {/* ประวัติการอนุมัติ */}
        {approvals.length > 0 && (
          <Card className="p-6 print:shadow-none print:border print:border-gray-300">
            <h3 className="text-lg font-semibold text-white print:text-black mb-4">ประวัติการอนุมัติ</h3>
            <div className="space-y-3">
              {approvals.map((approval, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 print:bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      {approval.decision === 'APPROVE' ? (
                        <CheckCircle className="w-4 h-4 text-green-400 print:text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 print:text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        approval.decision === 'APPROVE' 
                          ? 'text-green-400 print:text-green-600' 
                          : 'text-red-400 print:text-red-600'
                      }`}>
                        {approval.decision === 'APPROVE' ? 'อนุมัติ' : 'ปฏิเสธ'}
                      </span>
                    </div>
                    {approval.remark && (
                      <p className="text-white/70 print:text-gray-600 text-sm mt-1">
                        หมายเหตุ: {approval.remark}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 print:text-gray-600 text-xs">
                      {new Date(approval.created_at).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions - Hide in print */}
        <div className="flex space-x-3 pt-4 print:hidden">
          <Button
            variant="secondary"
            onClick={handlePrint}
            className="flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์</span>
          </Button>
          <Button variant="secondary" onClick={onClose} className="flex-1">
            ปิด
          </Button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 1cm;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print\\:text-black {
            color: black !important;
          }
          
          .print\\:text-gray-600 {
            color: #4b5563 !important;
          }
          
          .print\\:text-gray-700 {
            color: #374151 !important;
          }
          
          .print\\:border {
            border: 1px solid #d1d5db !important;
          }
          
          .print\\:border-gray-200 {
            border-color: #e5e7eb !important;
          }
          
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:bg-gray-50 {
            background-color: #f9fafb !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:space-y-4 > * + * {
            margin-top: 1rem !important;
          }
          
          .print\\:gap-2 {
            gap: 0.5rem !important;
          }
          
          .print\\:mb-2 {
            margin-bottom: 0.5rem !important;
          }
        }
      `}</style>
    </Modal>
  );
}