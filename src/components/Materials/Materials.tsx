import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useNotification } from '../../hooks/useNotification';
import { Material } from '../../types';
import { MaterialCard } from './MaterialCard';
import { MaterialForm } from './MaterialForm';
import { BarcodeScanner } from '../UI/BarcodeScanner';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Plus, Search, Filter, Scan } from 'lucide-react';

export function Materials() {
  const { state, dispatch } = useApp();
  const { addNotification } = useNotification();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  const filteredMaterials = state.materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Also filter by barcode if searching
  const finalFilteredMaterials = filteredMaterials.filter(material => {
    if (!searchTerm) return true;
    const matchesBarcode = material.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBarcode || 
           material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           material.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const categories = Array.from(new Set(state.materials.map(m => m.category)));

  const handleAddMaterial = (materialData: Omit<Material, 'id' | 'lastUpdated'>) => {
    const newMaterial: Material = {
      ...materialData,
      id: Date.now().toString(),
      lastUpdated: new Date()
    };

    dispatch({ type: 'ADD_MATERIAL', payload: newMaterial });
    addNotification({
      userId: state.currentUser?.id || '',
      title: 'Material Added',
      message: `${newMaterial.name} has been added to inventory`,
      type: 'success'
    });
  };

  const handleEditMaterial = (materialData: Omit<Material, 'id' | 'lastUpdated'>) => {
    if (!editingMaterial) return;

    const updatedMaterial: Material = {
      ...materialData,
      id: editingMaterial.id,
      lastUpdated: new Date()
    };

    dispatch({ type: 'UPDATE_MATERIAL', payload: updatedMaterial });
    addNotification({
      userId: state.currentUser?.id || '',
      title: 'Material Updated',
      message: `${updatedMaterial.name} has been updated`,
      type: 'success'
    });
    setEditingMaterial(null);
  };

  const handleDeleteMaterial = (materialId: string) => {
    const material = state.materials.find(m => m.id === materialId);
    if (!material) return;

    if (confirm(`Are you sure you want to delete ${material.name}?`)) {
      dispatch({ type: 'DELETE_MATERIAL', payload: materialId });
      addNotification({
        userId: state.currentUser?.id || '',
        title: 'Material Deleted',
        message: `${material.name} has been removed from inventory`,
        type: 'info'
      });
    }
  };

  const openEditForm = (material: Material) => {
    setEditingMaterial(material);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMaterial(null);
  };

  const handleBarcodeScanned = (barcode: string) => {
    // Search for material by barcode
    const material = state.materials.find(m => m.barcode === barcode);
    if (material) {
      // If found, highlight or scroll to the material
      setSearchTerm(barcode);
      addNotification({
        userId: state.currentUser?.id || '',
        title: 'Material Found',
        message: `Found material: ${material.name}`,
        type: 'success'
      });
    } else {
      // If not found, offer to create new material with this barcode
      if (confirm(`Material with barcode ${barcode} not found. Would you like to add it?`)) {
        setEditingMaterial({ 
          id: '', 
          barcode, 
          name: '', 
          category: '', 
          description: '', 
          unit: '', 
          stockQuantity: 0, 
          minStockLevel: 0, 
          pricePerUnit: 0, 
          supplier: '', 
          isActive: true, 
          lastUpdated: new Date() 
        } as Material);
        setIsFormOpen(true);
      }
    }
    setShowBarcodeScanner(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Materials Management</h2>
          <p className="text-white/60">Manage your inventory materials and stock levels</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => setShowBarcodeScanner(true)}
            className="flex items-center space-x-2"
          >
            <Scan className="w-5 h-5" />
            <span>Scan Barcode</span>
          </Button>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Material</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {finalFilteredMaterials.map(material => (
          <MaterialCard
            key={material.id}
            material={material}
            onEdit={openEditForm}
            onDelete={handleDeleteMaterial}
          />
        ))}
      </div>

      {finalFilteredMaterials.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-white/60 text-lg">
            {searchTerm || selectedCategory ? 'No materials found matching your criteria' : 'No materials added yet'}
          </p>
          {!searchTerm && !selectedCategory && (
            <Button
              onClick={() => setIsFormOpen(true)}
              className="mt-4"
            >
              Add Your First Material
            </Button>
          )}
        </Card>
      )}

      {/* Material Form Modal */}
      <MaterialForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingMaterial ? handleEditMaterial : handleAddMaterial}
        initialData={editingMaterial || undefined}
        mode={editingMaterial ? 'edit' : 'create'}
      />

      {/* Barcode Scanner */}
      <BarcodeScanner
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScan={handleBarcodeScanned}
        title="Scan Material Barcode"
      />
    </div>
  );
}