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
      setError(null);
      const newRequest = await BudgetService.createRequest(requestData);
      setRequests(prev => [newRequest, ...prev]);
      return newRequest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างคำขอ');
      throw err;
    }
  };

  const approveRequest = async (requestId: string, remark?: string, approverName?: string) => {
    try {
      setError(null);
      await BudgetService.addApproval({
        request_id: requestId,
        decision: 'APPROVE',
        remark,
        approver_name: approverName
      });
      await fetchRequests(); // รีเฟรชข้อมูล
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอนุมัติคำขอ');
      throw err;
    }
  };

  const rejectRequest = async (requestId: string, remark?: string, approverName?: string) => {
    try {
      setError(null);
      await BudgetService.addApproval({
        request_id: requestId,
        decision: 'REJECT',
        remark,
        approver_name: approverName
      });
      await fetchRequests(); // รีเฟรชข้อมูล
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการปฏิเสธคำขอ');
      throw err;
    }
  };

  const getApprovals = async (requestId: string): Promise<Approval[]> => {
    try {
      setError(null);
      return await BudgetService.getApprovals(requestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลการอนุมัติ');
      throw err;
    }
  };

  const deleteRequest = async (requestId: string) => {
    try {
      setError(null);
      await BudgetService.deleteRequest(requestId);
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบคำขอ');
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
    getApprovals,
    deleteRequest
  };
}