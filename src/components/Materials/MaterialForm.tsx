import React, { useState } from 'react';
import { Material } from '../../types';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { BarcodeScanner } from '../UI/BarcodeScanner';
import { Scan } from 'lucide-react';

interface MaterialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (material: Omit<Material, 'id' | 'lastUpdated'>) => void;
  initialData?: Material;
  mode: 'create' | 'edit';
}

export function MaterialForm({ isOpen, onClose, onSubmit, initialData, mode }: MaterialFormProps) {
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    barcode: initialData?.barcode || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    unit: initialData?.unit || '',
    stockQuantity: initialData?.stockQuantity || 0,
    minStockLevel: initialData?.minStockLevel || 0,
    pricePerUnit: initialData?.pricePerUnit || 0,
    supplier: initialData?.supplier || '',
    imageUrl: initialData?.imageUrl || '',
    isActive: initialData?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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
              <option value="เครื่องเขียน">เครื่องเขียน</option>
              <option value="อุปกรณ์ไอที">อุปกรณ์ไอที</option>
              <option value="เฟอร์นิเจอร์">เฟอร์นิเจอร์</option>
              <option value="อุปกรณ์ซ่อมบำรุง">อุปกรณ์ซ่อมบำรุง</option>
              <option value="อุปกรณ์ความปลอดภัย">อุปกรณ์ความปลอดภัย</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/80 mb-1">
              รายละเอียด
            </label>
            <textarea
              name="description"
              value={formData.description}
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
              สต็อกปัจจุบัน *
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
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
              name="minStockLevel"
              value={formData.minStockLevel}
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
              name="pricePerUnit"
              value={formData.pricePerUnit}
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
              ผู้จำหน่าย *
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อผู้จำหน่าย"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              URL รูปภาพ
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอก URL รูปภาพ"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
          />
          <label className="text-sm text-white/80">วัสดุใช้งานได้</label>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            {mode === 'create' ? 'เพิ่มวัสดุ' : 'อัปเดตวัสดุ'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
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