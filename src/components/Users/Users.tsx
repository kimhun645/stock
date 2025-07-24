import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useNotification } from '../../hooks/useNotification';
import { User } from '../../types';
import { UserForm } from './UserForm';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Plus, Search, Filter, Edit, Trash2, User as UserIcon } from 'lucide-react';

export function Users() {
  const { state, dispatch } = useApp();
  const { addNotification } = useNotification();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const filteredUsers = state.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesDepartment = !departmentFilter || user.department === departmentFilter;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const departments = Array.from(new Set(state.users.map(u => u.department)));

  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    dispatch({ type: 'ADD_USER', payload: newUser });
    addNotification({
      userId: state.currentUser?.id || '',
      title: 'User Added',
      message: `${newUser.name} has been added to the system`,
      type: 'success'
    });
  };

  const handleEditUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (!editingUser) return;

    const updatedUser: User = {
      ...userData,
      id: editingUser.id,
      createdAt: editingUser.createdAt
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    addNotification({
      userId: state.currentUser?.id || '',
      title: 'User Updated',
      message: `${updatedUser.name} has been updated`,
      type: 'success'
    });
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;

    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      dispatch({ type: 'DELETE_USER', payload: userId });
      addNotification({
        userId: state.currentUser?.id || '',
        title: 'User Deleted',
        message: `${user.name} has been removed from the system`,
        type: 'info'
      });
    }
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'manager':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'employee':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">จัดการผู้ใช้</h2>
          <p className="text-white/60">เพิ่ม แก้ไข และจัดการสิทธิ์ผู้ใช้ระบบ</p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>เพิ่มผู้ใช้</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้ใช้หรืออีเมล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
             <option value="">บทบาททั้งหมด</option>
             <option value="admin">ผู้ดูแลระบบ</option>
             <option value="manager">ผู้จัดการ</option>
             <option value="employee">พนักงาน</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">แผนกทั้งหมด</option>
              {departments.map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-white/70 text-sm border-b border-white/10">
                <th className="text-left py-3">ผู้ใช้</th>
                <th className="text-left py-3">บทบาท</th>
                <th className="text-left py-3">แผนก</th>
                <th className="text-left py-3">สถานะ</th>
                <th className="text-left py-3">วันที่สร้าง</th>
                <th className="text-right py-3">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-white/60 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getRoleBadgeColor(user.role)}`}>
                      {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 
                       user.role === 'manager' ? 'ผู้จัดการ' : 'พนักงาน'}
                    </span>
                  </td>
                  <td className="py-4 text-white/80">{user.department}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      user.isActive 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {user.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                    </span>
                  </td>
                  <td className="py-4 text-white/80">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openEditForm(user)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">
              {searchTerm || roleFilter || departmentFilter ? 'ไม่พบผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา' : 'ยังไม่มีผู้ใช้ในระบบ'}
            </p>
            {!searchTerm && !roleFilter && !departmentFilter && (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="mt-4"
              >
                เพิ่มผู้ใช้รายการแรก
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* User Form Modal */}
      <UserForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        initialData={editingUser || undefined}
        mode={editingUser ? 'edit' : 'create'}
      />
    </div>
  );
}