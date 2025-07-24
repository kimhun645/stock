import React, { useState } from 'react';
import { MaterialRequest, RequestItem, Material } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { Card } from '../UI/Card';
import { BarcodeScanner } from '../UI/BarcodeScanner';
import { Plus, Minus, Search, Scan, X } from 'lucide-react';

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<MaterialRequest, 'id' | 'requestNumber' | 'requestDate' | 'status' | 'approvals' | 'totalValue'>) => void;
}

export function RequestForm({ isOpen, onClose, onSubmit }: RequestFormProps) {
  const { state } = useApp();
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showMaterialSearch, setShowMaterialSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<RequestItem[]>([]);
  const [formData, setFormData] = useState({
    department: state.currentUser?.department || '',
    reason: '',
    urgencyLevel: 'medium' as const,
    expectedDate: '',
    notes: ''
  });

  const filteredMaterials = state.materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert('Please add at least one item to the request');
      return;
    }

    onSubmit({
      requesterId: state.currentUser?.id || '',
      requester: state.currentUser!,
      department: formData.department,
      items: selectedItems,
      reason: formData.reason,
      urgencyLevel: formData.urgencyLevel,
      expectedDate: formData.expectedDate ? new Date(formData.expectedDate) : undefined,
      notes: formData.notes
    });

    // Reset form
    setSelectedItems([]);
    setFormData({
      department: state.currentUser?.department || '',
      reason: '',
      urgencyLevel: 'medium',
      expectedDate: '',
      notes: ''
    });
    onClose();
  };

  const addMaterial = (material: Material) => {
    const existingItem = selectedItems.find(item => item.materialId === material.id);
    if (existingItem) {
      setSelectedItems(items =>
        items.map(item =>
          item.materialId === material.id
            ? { ...item, requestedQuantity: item.requestedQuantity + 1 }
            : item
        )
      );
    } else {
      const newItem: RequestItem = {
        materialId: material.id,
        material,
        requestedQuantity: 1
      };
      setSelectedItems(items => [...items, newItem]);
    }
    setShowMaterialSearch(false);
  };

  const updateQuantity = (materialId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(items => items.filter(item => item.materialId !== materialId));
    } else {
      setSelectedItems(items =>
        items.map(item =>
          item.materialId === materialId
            ? { ...item, requestedQuantity: quantity }
            : item
        )
      );
    }
  };

  const handleBarcodeScanned = (barcode: string) => {
    const material = state.materials.find(m => m.barcode === barcode);
    if (material) {
      addMaterial(material);
    } else {
      alert(`Material with barcode ${barcode} not found`);
    }
    setShowBarcodeScanner(false);
  };

  const totalValue = selectedItems.reduce(
    (sum, item) => sum + (item.requestedQuantity * item.material.pricePerUnit),
    0
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create Material Request" size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Department *
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                required
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Urgency Level *
              </label>
              <select
                value={formData.urgencyLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, urgencyLevel: e.target.value as any }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Expected Date
              </label>
              <input
                type="date"
                value={formData.expectedDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedDate: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Reason for Request *
              </label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                required
                placeholder="Brief reason for this request"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Add Materials Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Request Items</h3>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowBarcodeScanner(true)}
                  className="flex items-center space-x-2"
                >
                  <Scan className="w-4 h-4" />
                  <span>Scan</span>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowMaterialSearch(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </Button>
              </div>
            </div>

            {/* Selected Items */}
            <div className="space-y-3">
              {selectedItems.map((item) => (
                <Card key={item.materialId} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.material.name}</h4>
                      <p className="text-white/60 text-sm">{item.material.category}</p>
                      <p className="text-white/80 text-sm">
                        ₿{item.material.pricePerUnit} per {item.material.unit}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => updateQuantity(item.materialId, item.requestedQuantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-white font-medium w-12 text-center">
                          {item.requestedQuantity}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => updateQuantity(item.materialId, item.requestedQuantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          ₿{(item.requestedQuantity * item.material.pricePerUnit).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="danger"
                        onClick={() => updateQuantity(item.materialId, 0)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {selectedItems.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-white/60">No items added yet. Click "Add Item" or "Scan" to add materials.</p>
                </Card>
              )}
            </div>

            {/* Total Value */}
            {selectedItems.length > 0 && (
              <Card className="p-4 mt-4 bg-blue-500/10 border-blue-500/30">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Total Request Value:</span>
                  <span className="text-blue-400 font-bold text-lg">₿{totalValue.toLocaleString()}</span>
                </div>
              </Card>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional information or special instructions"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              Submit Request
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Material Search Modal */}
      <Modal
        isOpen={showMaterialSearch}
        onClose={() => setShowMaterialSearch(false)}
        title="Select Materials"
        size="lg"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredMaterials.map((material) => (
              <Card
                key={material.id}
                className="p-4 cursor-pointer hover:bg-white/15"
                onClick={() => addMaterial(material)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{material.name}</h4>
                    <p className="text-white/60 text-sm">{material.category}</p>
                    <p className="text-white/80 text-sm">
                      Stock: {material.stockQuantity} {material.unit} | ₿{material.pricePerUnit}
                    </p>
                  </div>
                  <Button size="sm" variant="primary">
                    Add
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
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