import React, { useState } from 'react';
import { Material } from '../../lib/supabase';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { BarcodeScanner } from '../UI/BarcodeScanner';
import { Scan } from 'lucide-react';

interface MaterialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (material: Omit<Material, 'id' | 'created_at' | 'updated_at'>) => void;
  initialData?: Material;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
}

export function MaterialForm({ isOpen, onClose, onSubmit, initialData, mode, isSubmitting = false }: MaterialFormProps) {
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    barcode: initialData?.barcode || '',
    material_code: initialData?.material_code || '',
    category: initialData?.category || '',
    note: initialData?.note || '',
    unit: initialData?.unit || '',
    initial_stock: initialData?.initial_stock || 0,
    current_stock: initialData?.current_stock || 0,
    min_stock: initialData?.min_stock || 0,
    price: initialData?.price || 0,
    location: initialData?.location || '',
    expiry_date: initialData?.expiry_date || ''
  });

  // Reset form when modal opens/closes or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || '',
        barcode: initialData?.barcode || '',
        material_code: initialData?.material_code || '',
        category: initialData?.category || '',
        note: initialData?.note || '',
        unit: initialData?.unit || '',
        initial_stock: initialData?.initial_stock || 0,
        current_stock: initialData?.current_stock || 0,
        min_stock: initialData?.min_stock || 0,
        price: initialData?.price || 0,
        location: initialData?.location || '',
        expiry_date: initialData?.expiry_date || ''
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleBarcodeScanned = (barcode: string) => {
    setFormData(prev => ({ ...prev, barcode }));
    setShowBarcodeScanner(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={mode === 'create' ? 'เพิ่มวัสดุใหม่' : 'แก้ไขวัสดุ'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                ชื่อวัสดุ *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอกชื่อวัสดุ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                รหัสวัสดุ
              </label>
              <input
                type="text"
                name="material_code"
                value={formData.material_code}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="กรอกรหัสวัสดุ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                บาร์โค้ด
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="กรอกหรือสแกนบาร์โค้ด"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowBarcodeScanner(true)}
                  className="px-3"
                >
                  <Scan className="w-4 h-4" />
                </Button>
              </div>
            </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              หมวดหมู่ *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">เลือกหมวดหมู่</option>
              <option value="วัสดุสำนักงาน">วัสดุสำนักงาน</option>
              <option value="ยา">ยา</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/80 mb-1">
              รายละเอียด
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกรายละเอียดวัสดุ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              หน่วย *
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="เช่น ชิ้น, กิโลกรัม, ลิตร"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              สต็อกเริ่มต้น *
            </label>
            <input
              type="number"
              name="initial_stock"
              value={formData.initial_stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกจำนวนสต็อกเริ่มต้น"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              สต็อกปัจจุบัน *
            </label>
            <input
              type="number"
              name="current_stock"
              value={formData.current_stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกจำนวนสต็อกปัจจุบัน"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              ระดับสต็อกขั้นต่ำ *
            </label>
            <input
              type="number"
              name="min_stock"
              value={formData.min_stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกระดับสต็อกขั้นต่ำ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              ราคาต่อหน่วย *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกราคาต่อหน่วย"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              ตำแหน่งจัดเก็บ
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกตำแหน่งจัดเก็บ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              วันหมดอายุ
              {formData.category === 'ยา' && <span className="text-red-400"> *</span>}
            </label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              required={formData.category === 'ยา'}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.category === 'ยา' && (
              <p className="text-white/60 text-xs mt-1">
                * จำเป็นต้องระบุวันหมดอายุสำหรับยา
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{mode === 'create' ? 'กำลังเพิ่ม...' : 'กำลังอัปเดต...'}</span>
              </div>
            ) : (
              mode === 'create' ? 'เพิ่มวัสดุ' : 'อัปเดตวัสดุ'
            )}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            ยกเลิก
          </Button>
        </div>
      </form>
      </Modal>

      <BarcodeScanner
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScan={handleBarcodeScanned}
        title="สแกนบาร์โค้ดวัสดุ"
      />
    </>
  );
}