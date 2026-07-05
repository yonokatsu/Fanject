import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Settings, Filter, Calendar, Gift, MessageSquare, UserPlus, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import './Notifications.css';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    new_message: true,
    event_reminder: true,
    giveaway_winner: true,
    exchange_response: true,
    new_follower: true,
    review_received: true
  });

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchSettings();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
      setFilteredNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setNotificationSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          ...notificationSettings
        });

      if (error) throw error;
      alert('บันทึกการตั้งค่าสำเร็จ');
      setShowSettings(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'message': return <MessageSquare size={20} />;
      case 'event': return <Calendar size={20} />;
      case 'giveaway': return <Gift size={20} />;
      case 'exchange': return <AlertCircle size={20} />;
      case 'follower': return <UserPlus size={20} />;
      case 'review': return <Star size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      message: 'bg-primary',
      event: 'bg-success',
      giveaway: 'bg-warning',
      exchange: 'bg-info',
      follower: 'bg-purple',
      review: 'bg-danger'
    };
    return colors[type] || 'bg-secondary';
  };

  const getFilteredData = () => {
    if (activeFilter === 'unread') {
      return notifications.filter(n => !n.is_read);
    } else if (activeFilter === 'read') {
      return notifications.filter(n => n.is_read);
    }
    return notifications;
  };

  useEffect(() => {
    setFilteredNotifications(getFilteredData());
  }, [activeFilter, notifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="loading-spinner">กำลังโหลดการแจ้งเตือน...</div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="d-flex align-items-center gap-3">
          <h2 className="mb-0"><Bell size={24} /> การแจ้งเตือน</h2>
          {unreadCount > 0 && (
            <span className="badge bg-danger">{unreadCount}</span>
          )}
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={18} /> ตั้งค่า
          </button>
          {unreadCount > 0 && (
            <button 
              className="btn btn-primary"
              onClick={handleMarkAllAsRead}
            >
              <Check size={18} /> อ่านทั้งหมด
            </button>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="settings-panel card p-4 mb-4">
          <h5>ตั้งค่าการแจ้งเตือน</h5>
          <div className="settings-grid">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    [key]: e.target.checked
                  })}
                />
                <label className="form-check-label" htmlFor={key}>
                  {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <button className="btn btn-success" onClick={handleSaveSettings}>
              บันทึกการตั้งค่า
            </button>
            <button 
              className="btn btn-secondary ms-2"
              onClick={() => setShowSettings(false)}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      <div className="filter-tabs mb-3">
        <button
          className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
          onClick={() => setActiveFilter('all')}
        >
          ทั้งหมด ({notifications.length})
        </button>
        <button
          className={`btn ${activeFilter === 'unread' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
          onClick={() => setActiveFilter('unread')}
        >
          ยังไม่อ่าน ({unreadCount})
        </button>
        <button
          className={`btn ${activeFilter === 'read' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setActiveFilter('read')}
        >
          อ่านแล้ว ({notifications.length - unreadCount})
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="empty-state text-center py-5">
          <Bell size={64} className="text-muted mb-3" />
          <h5>ไม่มีการแจ้งเตือน</h5>
          <p className="text-muted">การแจ้งเตือนเกี่ยวกับกิจกรรมของคุณจะปรากฏที่นี่</p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item card ${!notification.is_read ? 'unread' : ''}`}
            >
              <div className="card-body">
                <div className="d-flex align-items-start gap-3">
                  <div className={`type-icon ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="notification-title mb-1">
                          {notification.title}
                        </h6>
                        <p className="notification-message text-muted mb-2 small">
                          {notification.message}
                        </p>
                        <small className="text-muted">
                          {new Date(notification.created_at).toLocaleString('th-TH', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        {!notification.is_read && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="ทำเครื่องหมายว่าอ่านแล้ว"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteNotification(notification.id)}
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
