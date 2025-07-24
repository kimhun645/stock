import React, { useState } from 'react';
import { useMaterials } from '../../hooks/useMaterials';
import { Material as SupabaseMaterial } from '../../lib/supabase';
import { MaterialCard } from './MaterialCard';
import { MaterialForm } from './MaterialForm';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Plus, Search, Filter } from 'lucide-react';

export function Materials() {
  const { materials, loading, error, addMaterial, updateMaterial, deleteMaterial } = useMaterials();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<SupabaseMaterial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || material.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(materials.map(m => m.category).filter(Boolean)));

  const handleAddMaterial = async (materialData: Omit<SupabaseMaterial, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addMaterial(materialData);
      alert('เพิ่มวัสดุสำเร็จ');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการเพิ่มวัสดุ');
    }
  };

  const handleEditMaterial = async (materialData: Omit<SupabaseMaterial, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingMaterial) return;

    try {
      await updateMaterial(editingMaterial.id, materialData);
      setEditingMaterial(null);
      alert('อัปเดตวัสดุสำเร็จ');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปเดตวัสดุ');
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    if (!material) return;

    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบวัสดุ ${material.name}?`)) {
      try {
        await deleteMaterial(materialId);
        alert('ลบวัสดุสำเร็จ');
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบวัสดุ');
      }
    }
  };

  const openEditForm = (material: SupabaseMaterial) => {
    setEditingMaterial(material);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMaterial(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8">
        <p>เกิดข้อผิดพลาด: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">จัดการวัสดุ</h2>
          <p className="text-white/60">จัดการข้อมูลวัสดุและอุปกรณ์ในระบบ</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>เพิ่มวัสดุใหม่</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
            <input
              type="text"
              placeholder="ค้นหาวัสดุ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">ทุกหมวดหมู่</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map(material => (
          <MaterialCard
            key={material.id}
            material={material}
            onEdit={openEditForm}
            onDelete={handleDeleteMaterial}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">ไม่พบวัสดุ</h3>
          <p className="text-white/60 mb-4">
            {searchTerm || categoryFilter ? 'ไม่พบวัสดุที่ตรงกับเงื่อนไขการค้นหา' : 'ยังไม่มีวัสดุในระบบ'}
          </p>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>เพิ่มวัสดุแรก</span>
          </Button>
        </Card>
      )}

      {/* Material Form Modal */}
      {isFormOpen && (
        <MaterialForm
          material={editingMaterial}
          onSubmit={editingMaterial ? handleEditMaterial : handleAddMaterial}
          onClose={closeForm}
        />
      )}
    </div>
  );
}