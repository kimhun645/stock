import React, { useState } from 'react';
import { useAccountCodes } from '../../hooks/useAccountCodes';
import { BudgetService } from '../../services/budgetService';
import { EmailService } from '../../services/emailService';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { Card } from '../UI/Card';
import { Plus, Minus, X, Send } from 'lucide-react';

interface BudgetRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface RequestItem {
  item: string;
  quantity: number;
}

export function BudgetRequestForm({ isOpen, onClose, onSuccess }: BudgetRequestFormProps) {
  const { accountCodes, loading: accountLoading } = useAccountCodes();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    requester: '',
    approverEmail: '',
    accountCode: '',
    amount: 0,
    note: ''
  });

  const [items, setItems] = useState<RequestItem[]>([
    { item: '', quantity: 1 }
  ]);

  const selectedAccount = accountCodes.find(acc => acc.code === formData.accountCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ตรวจสอบว่าอีเมลผู้อนุมัติไม่เป็นค่าว่าง
    if (!formData.approverEmail || !formData.approverEmail.trim()) {
      alert('กรุณากรอกอีเมลผู้อนุมัติ');
      return;
    }
    
    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.approverEmail.trim())) {
      alert('กรุณากรอกอีเมลผู้อนุมัติให้ถูกต้อง');
      return;
    }
    
    if (items.some(item => !item.item.trim())) {
      alert('กรุณากรอกรายการให้ครบถ้วน');
      return;
    }
    
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // สร้างคำขอในฐานข้อมูล
      const requestData = {
        requester: formData.requester,
        request_date: new Date().toISOString().split('T')[0],
        account_code: formData.accountCode,
        account_name: selectedAccount?.name || '',
        amount: formData.amount,
        note: formData.note,
        material_list: items,
        status: 'PENDING' as const
      };

      const newRequest = await BudgetService.createRequest(requestData);

      // ส่งอีเมลแจ้งผู้อนุมัติ
      await EmailService.sendApprovalEmail({
        requestNo: newRequest.request_no || '',
        requester: formData.requester,
        approverEmail: formData.approverEmail,
        approverName: 'ผู้อนุมัติ', // คุณสามารถเพิ่มฟิลด์นี้ในฟอร์มได้หากต้องการ
        accountCode: formData.accountCode,
        accountName: selectedAccount?.name || '',
        amount: formData.amount,
        requestDate: new Date().toLocaleDateString('th-TH'),
        items: items,
        note: formData.note
      });

      alert('ส่งคำขอสำเร็จ! อีเมลแจ้งเตือนได้ถูกส่งไปยังผู้อนุมัติแล้ว');
      
      // รีเซ็ตฟอร์ม
      setFormData({
        requester: '',
        approverEmail: '',
        accountCode: '',
        amount: 0,
        note: ''
      });
      setItems([{ item: '', quantity: 1 }]);
      setShowConfirmation(false);
      onSuccess();
      
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('เกิดข้อผิดพลาดในการส่งคำขอ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    setItems([...items, { item: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof RequestItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const handleClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen && !showConfirmation} onClose={handleClose} title="สร้างคำขอใช้งบประมาณ" size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ข้อมูลพื้นฐาน */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                เลขที่คำขอ
              </label>
              <input
                type="text"
                value="ระบบจะสร้างให้อัตโนมัติ"
                disabled
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                วันที่
              </label>
              <input
                type="text"
                value={new Date().toLocaleDateString('th-TH')}
                disabled
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                ผู้ขอ *
              </label>
              <input
                type="text"
                value={formData.requester}
                onChange={(e) => setFormData(prev => ({ ...prev, requester: e.target.value }))}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอกชื่อผู้ขอ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                อีเมล์ผู้อนุมัติ *
              </label>
              <input
                type="email"
                value={formData.approverEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, approverEmail: e.target.value }))}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอกอีเมล์ผู้อนุมัติ"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/80 mb-1">
                เลือกรหัสบัญชี *
              </label>
              <select
                value={formData.accountCode}
                onChange={(e) => setFormData(prev => ({ ...prev, accountCode: e.target.value }))}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกรหัสบัญชี</option>
                {accountCodes.map(account => (
                  <option key={account.id} value={account.code}>
                    {account.code} - {account.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                จำนวนเงินที่ขอ (บาท) *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอกจำนวนเงิน"
              />
            </div>
          </div>

          {/* รายการที่ขอ */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">รายการที่ขอ</h3>
              <Button
                type="button"
                variant="secondary"
                onClick={addItem}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มรายการ</span>
              </Button>
            </div>

            <Card className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-white/70 text-sm border-b border-white/10">
                      <th className="text-left py-2 w-16">ลำดับ</th>
                      <th className="text-left py-2">รายการ</th>
                      <th className="text-left py-2 w-24">จำนวน</th>
                      <th className="text-center py-2 w-16">ลบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="py-3 text-white">{index + 1}</td>
                        <td className="py-3">
                          <input
                            type="text"
                            value={item.item}
                            onChange={(e) => updateItem(index, 'item', e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="กรอกรายการ"
                          />
                        </td>
                        <td className="py-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 text-center">
                          {items.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="danger"
                              onClick={() => removeItem(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* หมายเหตุ */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              หมายเหตุ
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกหมายเหตุเพิ่มเติม (ถ้ามี)"
            />
          </div>

          {/* ปุ่มส่งคำขอ */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              ส่งคำขอ
            </Button>
            <Button type="button" variant="secondary" onClick={handleClose}>
              ยกเลิก
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={showConfirmation} 
        onClose={() => setShowConfirmation(false)} 
        title="ตรวจสอบรายละเอียดคำขอ" 
        size="lg"
      >
        <div className="space-y-6">
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/60">ผู้ขอ:</p>
                <p className="text-white font-medium">{formData.requester}</p>
              </div>
              <div>
                <p className="text-white/60">อีเมล์ผู้อนุมัติ:</p>
                <p className="text-white font-medium">{formData.approverEmail}</p>
              </div>
              <div>
                <p className="text-white/60">รหัสบัญชี:</p>
                <p className="text-white font-medium">{formData.accountCode}</p>
              </div>
              <div>
                <p className="text-white/60">จำนวนเงิน:</p>
                <p className="text-white font-medium">{formData.amount.toLocaleString()} บาท</p>
              </div>
              <div className="col-span-2">
                <p className="text-white/60">ชื่อบัญชี:</p>
                <p className="text-white font-medium">{selectedAccount?.name}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-white font-medium mb-3">รายการที่ขอ:</h4>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-white">{index + 1}. {item.item}</span>
                  <span className="text-white/60">จำนวน {item.quantity}</span>
                </div>
              ))}
            </div>
          </Card>

          {formData.note && (
            <Card className="p-6">
              <h4 className="text-white font-medium mb-2">หมายเหตุ:</h4>
              <p className="text-white/80 text-sm">{formData.note}</p>
            </Card>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ยืนยันส่งคำขอ</span>
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmation(false)}
              disabled={isSubmitting}
            >
              แก้ไข
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}