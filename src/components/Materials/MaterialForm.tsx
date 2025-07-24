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
        title={mode === 'create' ? 'Add New Material' : 'Edit Material'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Material Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter material name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Barcode
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter or scan barcode"
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
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="IT Equipment">IT Equipment</option>
              <option value="Furniture">Furniture</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Safety Equipment">Safety Equipment</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/80 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter material description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Unit *
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., pieces, kg, liters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Current Stock *
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter current stock"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Minimum Stock Level *
            </label>
            <input
              type="number"
              name="minStockLevel"
              value={formData.minStockLevel}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter minimum stock level"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Price per Unit *
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
              placeholder="Enter price per unit"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Supplier *
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter supplier name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter image URL"
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
          <label className="text-sm text-white/80">Material is active</label>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            {mode === 'create' ? 'Add Material' : 'Update Material'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
      </Modal>

      <BarcodeScanner
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScan={handleBarcodeScanned}
        title="Scan Material Barcode"
      />
    </>
  );
}