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
  Printer,
  UserCheck
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
  const latestApproval = approvals.length > 0 ? approvals[approvals.length - 1] : null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="รายละเอียดคำขอใช้งบประมาณ" size="xl">
        <div className="space-y-6 print:space-y-4">
          {/* Header - Print Friendly */}
          <div className="print:text-black">
            <Card className="p-6 print:shadow-none print:border print:border-gray-300 print:bg-white">
              <div className="text-center mb-6 print:mb-4">
                <h1 className="text-2xl font-bold text-white print:text-black print:text-xl">
                  ใบขออนุมัติใช้เงินงบประมาณ
                </h1>
                <div className="mt-2 print:mt-1">
                  <span className="text-lg font-semibold text-white print:text-black print:text-base">
                    เลขที่: {request.request_no}
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between mb-4 print:mb-3 print:hidden">
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span className="text-white font-medium">
                    สถานะ: {getStatusText()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-3 print:text-sm">
                <div className="print:border print:border-gray-300 print:p-2">
                  <div className="flex items-center space-x-2 mb-1 print:hidden">
                    <User className="w-4 h-4 text-white/60" />
                    <span className="text-white/60 text-sm">ผู้ขอ</span>
                  </div>
                  <div className="print:block hidden">
                    <span className="font-medium">ผู้ขอ:</span>
                  </div>
                  <p className="text-white print:text-black font-medium">{request.requester}</p>
                </div>
                
                <div className="print:border print:border-gray-300 print:p-2">
                  <div className="flex items-center space-x-2 mb-1 print:hidden">
                    <Calendar className="w-4 h-4 text-white/60" />
                    <span className="text-white/60 text-sm">วันที่ขอ</span>
                  </div>
                  <div className="print:block hidden">
                    <span className="font-medium">วันที่ขอ:</span>
                  </div>
                  <p className="text-white print:text-black">
                    {new Date(request.request_date).toLocaleDateString('th-TH')}
                  </p>
                </div>

                <div className="print:border print:border-gray-300 print:p-2">
                  <div className="flex items-center space-x-2 mb-1 print:hidden">
                    <CreditCard className="w-4 h-4 text-white/60" />
                    <span className="text-white/60 text-sm">รหัสบัญชี</span>
                  </div>
                  <div className="print:block hidden">
                    <span className="font-medium">รหัสบัญชี:</span>
                  </div>
                  <p className="text-white print:text-black font-medium">{request.account_code}</p>
                </div>

                <div className="print:border print:border-gray-300 print:p-2">
                  <div className="flex items-center space-x-2 mb-1 print:hidden">
                    <span className="text-white/60 text-sm">จำนวนเงิน</span>
                  </div>
                  <div className="print:block hidden">
                    <span className="font-medium">จำนวนเงิน:</span>
                  </div>
                  <p className="text-white print:text-black font-bold text-lg print:text-base">
                    {request.amount.toLocaleString()} บาท
                  </p>
                </div>

                <div className="md:col-span-2 print:border print:border-gray-300 print:p-2">
                  <div className="print:block hidden">
                    <span className="font-medium">ชื่อบัญชี:</span>
                  </div>
                  <p className="text-white/60 print:text-gray-600 text-sm mb-1 print:hidden">ชื่อบัญชี</p>
                  <p className="text-white print:text-black">{request.account_name}</p>
                </div>

                {/* ผู้อนุมัติ - แสดงเฉพาะเมื่อมีการอนุมัติแล้ว */}
                {latestApproval && (
                  <div className="md:col-span-2 print:border print:border-gray-300 print:p-2">
                    <div className="flex items-center space-x-2 mb-1 print:hidden">
                      <UserCheck className="w-4 h-4 text-white/60" />
                      <span className="text-white/60 text-sm">ผู้อนุมัติ</span>
                    </div>
                    <div className="print:block hidden">
                      <span className="font-medium">ผู้อนุมัติ:</span>
                    </div>
                    <p className="text-white print:text-black font-medium">
                      {latestApproval.approver_name || 'ไม่ระบุชื่อ'} (อนุมัติเมื่อ {new Date(latestApproval.created_at).toLocaleDateString('th-TH')})
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* รายการที่ขอ */}
          <Card className="p-6 print:shadow-none print:border print:border-gray-300 print:bg-white">
            <div className="flex items-center space-x-2 mb-4 print:mb-3">
              <FileText className="w-5 h-5 text-white/60 print:hidden" />
              <h3 className="text-lg font-semibold text-white print:text-black print:text-base">รายการที่ขอ</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full print:text-black print:text-sm">
                <thead>
                  <tr className="text-white/70 print:text-black text-sm border-b border-white/10 print:border-gray-400">
                    <th className="text-left py-2 print:py-1 print:border print:border-gray-400 print:px-2">ลำดับ</th>
                    <th className="text-left py-2 print:py-1 print:border print:border-gray-400 print:px-2">รายการ</th>
                    <th className="text-right py-2 print:py-1 print:border print:border-gray-400 print:px-2">จำนวน</th>
                  </tr>
                </thead>
                <tbody className="text-white print:text-black">
                  {materialList.map((item, index) => (
                    <tr key={index} className="border-b border-white/5 print:border-gray-300">
                      <td className="py-3 print:py-2 print:border print:border-gray-400 print:px-2">{index + 1}</td>
                      <td className="py-3 print:py-2 print:border print:border-gray-400 print:px-2">{item.item}</td>
                      <td className="py-3 print:py-2 text-right print:border print:border-gray-400 print:px-2">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* หมายเหตุ */}
          {request.note && (
            <Card className="p-6 print:shadow-none print:border print:border-gray-300 print:bg-white">
              <h3 className="text-lg font-semibold text-white print:text-black print:text-base mb-3">หมายเหตุ</h3>
              <div className="print:border print:border-gray-300 print:p-2">
                <p className="text-white/80 print:text-black print:text-sm">{request.note}</p>
              </div>
            </Card>
          )}

          {/* ลายเซ็น - เฉพาะการพิมพ์ */}
          <div className="hidden print:block print:mt-8">
            <Card className="p-6 print:shadow-none print:border print:border-gray-300 print:bg-white">
              <div className="grid grid-cols-2 gap-8 print:text-sm">
                <div className="text-center">
                  <div className="border-b border-gray-400 mb-2 pb-8">
                    {/* พื้นที่สำหรับลายเซ็นผู้ขอ */}
                  </div>
                  <p className="font-medium">ลายเซ็นผู้ขอ</p>
                  <p>({request.requester})</p>
                  <p>วันที่ .........................</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-gray-400 mb-2 pb-8">
                    {/* พื้นที่สำหรับลายเซ็นผู้อนุมัติ */}
                  </div>
                  <p className="font-medium">ลายเซ็นผู้อนุมัติ</p>
                  <p>(...........................)</p>
                  <p>วันที่ .........................</p>
                </div>
              </div>
            </Card>
          </div>

          {/* ประวัติการอนุมัติ - ไม่แสดงในการพิมพ์ */}
          {approvals.length > 0 && (
            <Card className="p-6 print:hidden">
              <h3 className="text-lg font-semibold text-white mb-4">ประวัติการอนุมัติ</h3>
              <div className="space-y-3">
                {approvals.map((approval, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2">
                        {approval.decision === 'APPROVE' ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm font-medium ${
                          approval.decision === 'APPROVE' 
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {approval.decision === 'APPROVE' ? 'อนุมัติ' : 'ปฏิเสธ'}
                        </span>
                      </div>
                      {approval.remark && (
                        <p className="text-white/70 text-sm mt-1">
                          หมายเหตุ: {approval.remark}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs">
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
      </Modal>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 1.5cm;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            font-family: 'Sarabun', sans-serif;
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
            border: 1px solid #000 !important;
          }
          
          .print\\:border-gray-300 {
            border-color: #000 !important;
          }
          
          .print\\:border-gray-400 {
            border-color: #000 !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:bg-white {
            background-color: white !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
          
          .print\\:space-y-4 > * + * {
            margin-top: 1rem !important;
          }
          
          .print\\:gap-3 {
            gap: 0.75rem !important;
          }
          
          .print\\:mb-2 {
            margin-bottom: 0.5rem !important;
          }
          
          .print\\:mb-3 {
            margin-bottom: 0.75rem !important;
          }
          
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
          
          .print\\:mt-1 {
            margin-top: 0.25rem !important;
          }
          
          .print\\:mt-8 {
            margin-top: 2rem !important;
          }
          
          .print\\:p-2 {
            padding: 0.5rem !important;
          }
          
          .print\\:px-2 {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
          
          .print\\:py-1 {
            padding-top: 0.25rem !important;
            padding-bottom: 0.25rem !important;
          }
          
          .print\\:py-2 {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          
          .print\\:text-xs {
            font-size: 0.75rem !important;
          }
          
          .print\\:text-sm {
            font-size: 0.875rem !important;
          }
          
          .print\\:text-base {
            font-size: 1rem !important;
          }
          
          .print\\:text-xl {
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </>
  );
}