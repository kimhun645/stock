import { supabase, Material } from '../lib/supabase';

export class MaterialService {
  // ดึงข้อมูลวัสดุทั้งหมด
  static async getAllMaterials(): Promise<Material[]> {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }

    return data || [];
  }

  // เพิ่มวัสดุใหม่
  static async createMaterial(material: Omit<Material, 'id' | 'created_at' | 'updated_at'>): Promise<Material> {
    const { data, error } = await supabase
      .from('materials')
      .insert([{
        ...material,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating material:', error);
      throw error;
    }

    return data;
  }

  // อัปเดตวัสดุ
  static async updateMaterial(id: string, updates: Partial<Material>): Promise<Material> {
    const { data, error } = await supabase
      .from('materials')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating material:', error);
      throw error;
    }

    return data;
  }

  // ลบวัสดุ
  static async deleteMaterial(id: string): Promise<void> {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  }

  // ค้นหาวัสดุด้วยบาร์โค้ด
  static async findByBarcode(barcode: string): Promise<Material | null> {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('barcode', barcode)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error finding material by barcode:', error);
      throw error;
    }

    return data || null;
  }

  // ดึงวัสดุที่สต็อกต่ำ
  static async getLowStockMaterials(): Promise<Material[]> {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .filter('current_stock', 'lte', 'min_stock')
      .order('name');

    if (error) {
      console.error('Error fetching low stock materials:', error);
      throw error;
    }

    return data || [];
  }
}