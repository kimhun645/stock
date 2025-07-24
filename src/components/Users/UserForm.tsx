import React, { useState } from 'react';
import { User } from '../../types';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Omit<User, 'id' | 'createdAt'>) => void;
  initialData?: User;
  mode: 'create' | 'edit';
}

export function UserForm({ isOpen, onClose, onSubmit, initialData, mode }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    role: initialData?.role || 'employee' as const,
    department: initialData?.department || '',
    avatar: initialData?.avatar || '',
    isActive: initialData?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'เพิ่มผู้ใช้ใหม่' : 'แก้ไขผู้ใช้'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            ชื่อ-นามสกุล *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="กรอกชื่อ-นามสกุล"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            อีเมล *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="กรอกที่อยู่อีเมล"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            บทบาท *
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="employee">พนักงาน</option>
            <option value="manager">ผู้จัดการ</option>
            <option value="admin">ผู้ดูแลระบบ</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            แผนก *
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="กรอกแผนก"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            URL รูปโปรไฟล์
          </label>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="กรอก URL รูปโปรไฟล์"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
          />
          <label className="text-sm text-white/80">ผู้ใช้สามารถใช้งานได้</label>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            {mode === 'create' ? 'เพิ่มผู้ใช้' : 'อัปเดตผู้ใช้'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            ยกเลิก
          </Button>
        </div>
      </form>
    </Modal>
  );
}