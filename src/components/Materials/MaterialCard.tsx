import React from 'react';
import { Material } from '../../lib/supabase';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Package, AlertTriangle, Edit, Trash2, Scan } from 'lucide-react';

interface MaterialCardProps {
  material: Material;
  onEdit: (material: Material) => void;
  onDelete: (materialId: string) => void;
}

export function MaterialCard({ material, onEdit, onDelete }: MaterialCardProps) {
  const isLowStock = material.current_stock <= material.min_stock;

  return (
    <Card className="p-6 hover:scale-105 transition-transform duration-300">
      <div className="flex items-start space-x-4">
        {/* Material Image */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="w-8 h-8 text-white" />
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-white">{material.name}</h3>
              <p className="text-white/60 text-sm">{material.category || 'ไม่ระบุหมวดหมู่'}</p>
            </div>
            {isLowStock && (
              <div className="flex items-center space-x-1 text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs">สต็อกต่ำ</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-white/70 text-sm mb-3">{material.note || 'ไม่มีรายละเอียด'}</p>

          {/* Barcode */}
          {material.barcode && (
            <div className="mb-3">
              <div className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                <Scan className="w-4 h-4 text-white/60" />
                <span className="text-white/80 font-mono text-sm">รหัส: {material.barcode}</span>
              </div>
            </div>
          )}

          {/* Stock Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-white/60 text-xs">สต็อกปัจจุบัน</p>
              <p className="text-white font-medium">
                {material.current_stock} {material.unit || 'หน่วย'}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs">ระดับขั้นต่ำ</p>
              <p className="text-white font-medium">
                {material.min_stock} {material.unit || 'หน่วย'}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs">ราคา/หน่วย</p>
              <p className="text-white font-medium">₿{material.price}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs">ตำแหน่ง</p>
              <p className="text-white font-medium text-sm">{material.location || 'ไม่ระบุ'}</p>
            </div>
          </div>

          {/* Stock Level Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/60 text-xs">ระดับสต็อก</span>
              <span className="text-white/60 text-xs">
                {Math.round((material.stockQuantity / Math.max(material.minStockLevel * 3, 1)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isLowStock
                    ? 'bg-gradient-to-r from-red-500 to-yellow-500'
                    : 'bg-gradient-to-r from-green-500 to-blue-500'
                }`}
                style={{
                  width: `${Math.min(
                    (material.current_stock / Math.max(material.min_stock * 3, 1)) * 100,
                    100
                  )}%`
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(material)}
              className="flex items-center space-x-1"
            >
              <Edit className="w-4 h-4" />
              <span>แก้ไข</span>
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(material.id)}
              className="flex items-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>ลบ</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}