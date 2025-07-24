import { useState, useEffect } from 'react';
import { MaterialService } from '../services/materialService';
import { Material } from '../lib/supabase';

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MaterialService.getAllMaterials();
      setMaterials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลวัสดุ');
    } finally {
      setLoading(false);
    }
  };

  const addMaterial = async (materialData: Omit<Material, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const newMaterial = await MaterialService.createMaterial(materialData);
      setMaterials(prev => [...prev, newMaterial]);
      return newMaterial;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเพิ่มวัสดุ');
      throw err;
    }
  };

  const updateMaterial = async (id: string, updates: Partial<Material>) => {
    try {
      setError(null);
      const updatedMaterial = await MaterialService.updateMaterial(id, updates);
      setMaterials(prev => prev.map(m => m.id === id ? updatedMaterial : m));
      return updatedMaterial;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปเดตวัสดุ');
      throw err;
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      setError(null);
      await MaterialService.deleteMaterial(id);
      setMaterials(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบวัสดุ');
      throw err;
    }
  };

  const findByBarcode = async (barcode: string) => {
    try {
      setError(null);
      return await MaterialService.findByBarcode(barcode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการค้นหาบาร์โค้ด');
      throw err;
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return {
    materials,
    loading,
    error,
    fetchMaterials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    findByBarcode
  };
}