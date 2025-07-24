import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Material, MaterialRequest, Notification, DashboardStats } from '../types';

interface AppState {
  currentUser: User | null;
  users: User[];
  materials: Material[];
  requests: MaterialRequest[];
  notifications: Notification[];
  dashboardStats: DashboardStats;
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_MATERIALS'; payload: Material[] }
  | { type: 'ADD_MATERIAL'; payload: Material }
  | { type: 'UPDATE_MATERIAL'; payload: Material }
  | { type: 'DELETE_MATERIAL'; payload: string }
  | { type: 'SET_REQUESTS'; payload: MaterialRequest[] }
  | { type: 'ADD_REQUEST'; payload: MaterialRequest }
  | { type: 'UPDATE_REQUEST'; payload: MaterialRequest }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats };

const initialState: AppState = {
  currentUser: null,
  users: [],
  materials: [],
  requests: [],
  notifications: [],
  dashboardStats: {
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    completedRequests: 0,
    totalMaterials: 0,
    lowStockItems: 0,
    totalValue: 0,
    monthlyTrend: []
  },
  isLoading: false,
  error: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        )
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    case 'SET_MATERIALS':
      return { ...state, materials: action.payload };
    case 'ADD_MATERIAL':
      return { ...state, materials: [...state.materials, action.payload] };
    case 'UPDATE_MATERIAL':
      return {
        ...state,
        materials: state.materials.map(material => 
          material.id === action.payload.id ? action.payload : material
        )
      };
    case 'DELETE_MATERIAL':
      return {
        ...state,
        materials: state.materials.filter(material => material.id !== action.payload)
      };
    case 'SET_REQUESTS':
      return { ...state, requests: action.payload };
    case 'ADD_REQUEST':
      return { ...state, requests: [...state.requests, action.payload] };
    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map(request => 
          request.id === action.payload.id ? action.payload : request
        )
      };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        )
      };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Mock current user
    const currentUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'manager',
      department: 'IT',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      isActive: true,
      createdAt: new Date()
    };

    // Mock materials
    const materials: Material[] = [
      {
        id: '1',
        barcode: '1234567890123',
        name: 'กระดาษ A4',
        category: 'เครื่องเขียน',
        description: 'กระดาษ A4 คุณภาพสูงสำหรับการพิมพ์',
        unit: 'รีม',
        stockQuantity: 50,
        minStockLevel: 10,
        pricePerUnit: 120,
        supplier: 'บริษัท ออฟฟิศ พลัส จำกัด',
        imageUrl: 'https://images.pexels.com/photos/518244/pexels-photo-518244.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        isActive: true,
        lastUpdated: new Date()
      },
      {
        id: '2',
        barcode: '2345678901234',
        name: 'คอมพิวเตอร์โน้ตบุ๊ก',
        category: 'อุปกรณ์ไอที',
        description: 'Dell Latitude 7420 โน้ตบุ๊กสำหรับธุรกิจ',
        unit: 'เครื่อง',
        stockQuantity: 5,
        minStockLevel: 2,
        pricePerUnit: 35000,
        supplier: 'บริษัท เทค โซลูชั่น จำกัด',
        imageUrl: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        isActive: true,
        lastUpdated: new Date()
      },
      {
        id: '3',
        barcode: '3456789012345',
        name: 'ปากกาเมจิก',
        category: 'เครื่องเขียน',
        description: 'ชุดปากกาเมจิกถาวร',
        unit: 'ชุด',
        stockQuantity: 25,
        minStockLevel: 5,
        pricePerUnit: 85,
        supplier: 'สเตชันเนอรี่ เวิลด์',
        imageUrl: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
        isActive: true,
        lastUpdated: new Date()
      }
    ];

    // Mock users
    const users: User[] = [
      currentUser,
      {
        id: '2',
        name: 'สุดา วิลสัน',
        email: 'sarah.wilson@company.com',
        role: 'employee',
        department: 'ทรัพยากรบุคคล',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        isActive: true,
        createdAt: new Date('2024-01-10')
      },
      {
        id: '3',
        name: 'วิชัย จอห์นสัน',
        email: 'mike.johnson@company.com',
        role: 'admin',
        department: 'การเงิน',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        isActive: true,
        createdAt: new Date('2024-01-05')
      }
    ];

    // Mock requests
    const requests: MaterialRequest[] = [
      {
        id: '1',
        requestNumber: 'REQ-001',
        requesterId: '2',
        requester: users[1],
        department: 'ทรัพยากรบุคคล',
        requestDate: new Date('2024-01-15'),
        items: [
          {
            materialId: '1',
            material: materials[0],
            requestedQuantity: 10,
            approvedQuantity: 10
          }
        ],
        status: 'pending',
        approvals: [],
        totalValue: 1200,
        reason: 'เครื่องเขียนสำหรับพนักงานใหม่',
        urgencyLevel: 'medium',
        expectedDate: new Date('2024-01-20')
      },
      {
        id: '2',
        requestNumber: 'REQ-002',
        requesterId: '3',
        requester: users[2],
        department: 'การเงิน',
        requestDate: new Date('2024-01-14'),
        items: [
          {
            materialId: '2',
            material: materials[1],
            requestedQuantity: 2,
            approvedQuantity: 2
          }
        ],
        status: 'approved',
        approvals: [],
        totalValue: 70000,
        reason: 'เปลี่ยนโน้ตบุ๊กสำหรับทีมการเงิน',
        urgencyLevel: 'high',
        expectedDate: new Date('2024-01-18')
      }
    ];

    dispatch({ type: 'SET_CURRENT_USER', payload: currentUser });
    dispatch({ type: 'SET_USERS', payload: users });
    dispatch({ type: 'SET_MATERIALS', payload: materials });
    dispatch({ type: 'SET_REQUESTS', payload: requests });

    // Calculate dashboard stats
    const stats: DashboardStats = {
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      approvedRequests: requests.filter(r => r.status === 'approved').length,
      completedRequests: requests.filter(r => r.status === 'completed').length,
      totalMaterials: materials.length,
      lowStockItems: materials.filter(m => m.stockQuantity <= m.minStockLevel).length,
      totalValue: requests.reduce((sum, r) => sum + r.totalValue, 0),
      monthlyTrend: [
        { month: 'ม.ค.', requests: 15, value: 450000 },
        { month: 'ก.พ.', requests: 22, value: 680000 },
        { month: 'มี.ค.', requests: 18, value: 520000 },
        { month: 'เม.ย.', requests: 24, value: 750000 },
        { month: 'พ.ค.', requests: 20, value: 620000 },
        { month: 'มิ.ย.', requests: 28, value: 890000 }
      ]
    };

    dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats });
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}