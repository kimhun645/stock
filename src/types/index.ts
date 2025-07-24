export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Material {
  id: string;
  barcode?: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  stockQuantity: number;
  minStockLevel: number;
  pricePerUnit: number;
  supplier: string;
  imageUrl?: string;
  isActive: boolean;
  lastUpdated: Date;
}

export interface RequestItem {
  materialId: string;
  material: Material;
  requestedQuantity: number;
  approvedQuantity?: number;
  notes?: string;
}

export interface MaterialRequest {
  id: string;
  requestNumber: string;
  requesterId: string;
  requester: User;
  department: string;
  requestDate: Date;
  items: RequestItem[];
  status: 'pending' | 'approved' | 'rejected' | 'partially_approved' | 'completed';
  approvals: Approval[];
  totalValue: number;
  reason: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  expectedDate?: Date;
  completedDate?: Date;
  notes?: string;
}

export interface Approval {
  id: string;
  approverId: string;
  approver: User;
  level: number;
  status: 'pending' | 'approved' | 'rejected';
  approvedDate?: Date;
  comments?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  completedRequests: number;
  totalMaterials: number;
  lowStockItems: number;
  totalValue: number;
  monthlyTrend: { month: string; requests: number; value: number }[];
}