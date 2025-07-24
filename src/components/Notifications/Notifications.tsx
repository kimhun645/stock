import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useNotification } from '../../hooks/useNotification';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, Trash2, BookMarked as MarkAsRead } from 'lucide-react';

export function Notifications() {
  const { state } = useApp();
  const { markAsRead } = useNotification();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNotificationBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30';
      case 'warning':
        return 'border-yellow-500/30';
      case 'error':
        return 'border-red-500/30';
      case 'info':
      default:
        return 'border-blue-500/30';
    }
  };

  const unreadNotifications = state.notifications.filter(n => !n.isRead);
  const readNotifications = state.notifications.filter(n => n.isRead);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">การแจ้งเตือน</h2>
          <p className="text-white/60">ติดตามกิจกรรมและการแจ้งเตือนของระบบ</p>
        </div>
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-white/60" />
          <span className="text-white/80">
            {unreadNotifications.length} ยังไม่อ่าน
          </span>
        </div>
      </div>

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">การแจ้งเตือนที่ยังไม่อ่าน</h3>
          <div className="space-y-3">
            {unreadNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`p-4 border-l-4 ${getNotificationBorderColor(notification.type)} bg-white/5`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{notification.title}</h4>
                    <p className="text-white/70 text-sm mt-1">{notification.message}</p>
                    <p className="text-white/50 text-xs mt-2">
                      {notification.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => markAsRead(notification.id)}
                      className="flex items-center space-x-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>ทำเครื่องหมายว่าอ่านแล้ว</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">การแจ้งเตือนที่อ่านแล้ว</h3>
          <div className="space-y-3">
            {readNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className="p-4 opacity-60 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{notification.title}</h4>
                    <p className="text-white/70 text-sm mt-1">{notification.message}</p>
                    <p className="text-white/50 text-xs mt-2">
                      {notification.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      size="sm"
                      variant="danger"
                      className="flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {state.notifications.length === 0 && (
        <Card className="p-12 text-center">
          <Bell className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">ไม่มีการแจ้งเตือน</h3>
          <p className="text-white/60">คุณได้อ่านการแจ้งเตือนทั้งหมดแล้ว ไม่มีการแจ้งเตือนใหม่ในขณะนี้</p>
        </Card>
      )}

      {/* Notification Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">การตั้งค่าการแจ้งเตือน</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">คำขอวัสดุ</h4>
              <p className="text-white/60 text-sm">รับการแจ้งเตือนเมื่อมีคำขอวัสดุใหม่</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">แจ้งเตือนสต็อกต่ำ</h4>
              <p className="text-white/60 text-sm">รับการแจ้งเตือนเมื่อวัสดุใกล้หมด</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">อัปเดตการอนุมัติ</h4>
              <p className="text-white/60 text-sm">รับการแจ้งเตือนเมื่อคำขอได้รับการอนุมัติหรือปฏิเสธ</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">อัปเดตระบบ</h4>
              <p className="text-white/60 text-sm">รับการแจ้งเตือนเกี่ยวกับการบำรุงรักษาและอัปเดตระบบ</p>
            </div>
            <input
              type="checkbox"
              className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}