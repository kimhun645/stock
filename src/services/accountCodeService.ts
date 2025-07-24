import { supabase, AccountCode } from '../lib/supabase';

export class AccountCodeService {
  // ดึงรหัสบัญชีทั้งหมด
  static async getAllAccountCodes(): Promise<AccountCode[]> {
    const { data, error } = await supabase
      .from('account_codes')
      .select('*')
      .eq('is_active', true)
      .order('code');

    if (error) {
      console.error('Error fetching account codes:', error);
      throw error;
    }

    return data || [];
  }

  // เพิ่มรหัสบัญชีใหม่
  static async createAccountCode(accountCode: Omit<AccountCode, 'id'>): Promise<AccountCode> {
    const { data, error } = await supabase
      .from('account_codes')
      .insert([accountCode])
      .select()
      .single();

    if (error) {
      console.error('Error creating account code:', error);
      throw error;
    }

    return data;
  }

  // อัปเดตรหัสบัญชี
  static async updateAccountCode(id: string, updates: Partial<AccountCode>): Promise<AccountCode> {
    const { data, error } = await supabase
      .from('account_codes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating account code:', error);
      throw error;
    }

    return data;
  }

  // ลบรหัสบัญชี
  static async deleteAccountCode(id: string): Promise<void> {
    const { error } = await supabase
      .from('account_codes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting account code:', error);
      throw error;
    }
  }
}