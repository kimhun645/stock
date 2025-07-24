import { useState, useEffect } from 'react';
import { AccountCodeService } from '../services/accountCodeService';
import { AccountCode } from '../lib/supabase';

export function useAccountCodes() {
  const [accountCodes, setAccountCodes] = useState<AccountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AccountCodeService.getAllAccountCodes();
      setAccountCodes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลรหัสบัญชี');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountCodes();
  }, []);

  return {
    accountCodes,
    loading,
    error,
    fetchAccountCodes
  };
}