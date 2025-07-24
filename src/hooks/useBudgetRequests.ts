import { useState, useEffect } from 'react';
import { BudgetService } from '../services/budgetService';
import { BudgetRequest, Approval } from '../lib/supabase';

export function useBudgetRequests() {
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BudgetService.getAllRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลคำขอ');
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: Omit<BudgetRequest, 'id' | 'created_at'>) => {
    try {
      const newRequest = await BudgetService.createRequest(requestData);
      setRequests(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างคำขอ');
      throw err;
    }
  };

  const approveRequest = async (requestId: string, remark?: string) => {
    try {
      await BudgetService.addApproval({
        request_id: requestId,
        decision: 'APPROVE',
        remark
      });
      await fetchRequests(); // รีเฟรชข้อมูล
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอนุมัติคำขอ');
      throw err;
    }
  };

  const rejectRequest = async (requestId: string, remark?: string) => {
    try {
      await BudgetService.addApproval({
        request_id: requestId,
        decision: 'REJECT',
        remark
      });
      await fetchRequests(); // รีเฟรชข้อมูล
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการปฏิเสธคำขอ');
      throw err;
    }
  };

  const getApprovals = async (requestId: string): Promise<Approval[]> => {
    try {
      return await BudgetService.getApprovals(requestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลการอนุมัติ');
      throw err;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    approveRequest,
    rejectRequest,
    getApprovals
  };
}