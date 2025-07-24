import { supabase, BudgetRequest, Approval } from '../lib/supabase';

export class BudgetService {
  // ดึงคำขอใช้งบประมาณทั้งหมด
  static async getAllRequests(): Promise<BudgetRequest[]> {
    const { data, error } = await supabase
      .from('budget_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching budget requests:', error);
      throw error;
    }

    return data || [];
  }

  // สร้างคำขอใหม่
  static async createRequest(request: Omit<BudgetRequest, 'id' | 'created_at'>): Promise<BudgetRequest> {
    // สร้างเลขที่คำขอ
    const requestNo = `REQ-${Date.now().toString().slice(-6)}`;
    
    const { data, error } = await supabase
      .from('budget_requests')
      .insert([{
        ...request,
        request_no: requestNo
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating budget request:', error);
      throw error;
    }

    return data;
  }

  // อัปเดตสถานะคำขอ
  static async updateRequestStatus(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<BudgetRequest> {
    const { data, error } = await supabase
      .from('budget_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating request status:', error);
      throw error;
    }

    return data;
  }

  // เพิ่มการอนุมัติ
  static async addApproval(approval: Omit<Approval, 'id' | 'created_at'> & { approver_name?: string }): Promise<Approval> {
    const { data, error } = await supabase
      .from('approvals')
      .insert([approval])
      .select()
      .single();

    if (error) {
      console.error('Error adding approval:', error);
      throw error;
    }

    // อัปเดตสถานะคำขอ
    const newStatus = approval.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    await this.updateRequestStatus(approval.request_id, newStatus);

    return data;
  }

  // ดึงการอนุมัติของคำขอ
  static async getApprovals(requestId: string): Promise<Approval[]> {
    const { data, error } = await supabase
      .from('approvals')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at');

    if (error) {
      console.error('Error fetching approvals:', error);
      throw error;
    }

    return data || [];
  }

  // ลบคำขอใช้งบประมาณ
  static async deleteRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('budget_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting budget request:', error);
      throw error;
    }
  }
}