import { supabase, Transaction } from '../lib/supabase';

export class TransactionService {
  // ดึงประวัติการเคลื่อนไหวทั้งหมด
  static async getAllTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        materials (
          name,
          unit
        )
      `)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }

    return data || [];
  }

  // เพิ่มการเคลื่อนไหวใหม่
  static async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }

    // อัปเดตสต็อกวัสดุ
    await this.updateMaterialStock(transaction.material_id, transaction.type, transaction.quantity);

    return data;
  }

  // อัปเดตสต็อกวัสดุ
  private static async updateMaterialStock(materialId: string, type: 'in' | 'out', quantity: number): Promise<void> {
    // ดึงสต็อกปัจจุบัน
    const { data: material, error: fetchError } = await supabase
      .from('materials')
      .select('current_stock')
      .eq('id', materialId)
      .single();

    if (fetchError) {
      console.error('Error fetching material stock:', fetchError);
      throw fetchError;
    }

    // คำนวณสต็อกใหม่
    const currentStock = material.current_stock;
    const newStock = type === 'in' ? currentStock + quantity : currentStock - quantity;

    // อัปเดตสต็อก
    const { error: updateError } = await supabase
      .from('materials')
      .update({ 
        current_stock: Math.max(0, newStock), // ป้องกันสต็อกติดลบ
        updated_at: new Date().toISOString()
      })
      .eq('id', materialId);

    if (updateError) {
      console.error('Error updating material stock:', updateError);
      throw updateError;
    }
  }

  // ดึงประวัติของวัสดุเฉพาะ
  static async getMaterialTransactions(materialId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('material_id', materialId)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Error fetching material transactions:', error);
      throw error;
    }

    return data || [];
  }
}