import React, { useState, useEffect } from 'react';
import { Repeat, Clock, Users, CheckCircle, XCircle, Plus } from 'lucide-react';
import supabase from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const Exchanges = () => {
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const { data, error } = await supabase
        .from('exchange_requests')
        .select(`
          *,
          from_user:users!exchange_requests_from_user_id_fkey (username, avatar_url),
          to_user:users!exchange_requests_to_user_id_fkey (username, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setExchanges(data || []);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (exchangeId, accept) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('exchange_requests')
        .update({
          status: accept ? 'accepted' : 'rejected',
          responded_at: new Date().toISOString()
        })
        .eq('id', exchangeId);
      
      if (error) throw error;
      alert(accept ? 'ยอมรับคำขอแลกเปลี่ยนแล้ว!' : 'ปฏิเสธคำขอแลกเปลี่ยนแล้ว');
      fetchExchanges();
    } catch (error) {
      console.error('Error responding to exchange:', error);
      alert('เกิดข้อผิดพลาดในการตอบกลับ');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="badge bg-warning">รอการตอบกลับ</span>;
      case 'accepted':
        return <span className="badge bg-success"><CheckCircle size={12} className="me-1"/> ยอมรับแล้ว</span>;
      case 'rejected':
        return <span className="badge bg-danger"><XCircle size={12} className="me-1"/> ปฏิเสธแล้ว</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <Repeat className="me-2" size={24} />
          แลกเปลี่ยนตั๋ว/สินค้า
        </h2>
        {user && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={20} className="me-1" />
            สร้างคำขอใหม่
          </button>
        )}
      </div>

      {/* Exchange Requests List */}
      {exchanges.length === 0 ? (
        <div className="text-center py-5">
          <Repeat size={48} className="text-muted mb-3" />
          <h5 className="text-muted">ยังไม่มีคำขอแลกเปลี่ยน</h5>
          <p className="text-muted">เป็นคนที่สร้างคำขอแรก!</p>
        </div>
      ) : (
        <div className="row g-4">
          {exchanges.map((exchange) => (
            <div key={exchange.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">{exchange.title}</h5>
                    {getStatusBadge(exchange.status)}
                  </div>
                  
                  <div className="mb-3">
                    <p className="card-text small mb-2">
                      <strong>สิ่งที่เสนอ:</strong> {exchange.offered_item}
                    </p>
                    <p className="card-text small mb-2">
                      <strong>สิ่งที่ต้องการ:</strong> {exchange.requested_item}
                    </p>
                    {exchange.description && (
                      <p className="card-text small text-muted">
                        {exchange.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-2">
                    <Clock size={16} className="me-1" />
                    <span className="small">
                      สร้างเมื่อ: {new Date(exchange.created_at).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {exchange.from_user && (
                    <div className="mb-3 small text-muted">
                      โดย: {exchange.from_user.username}
                    </div>
                  )}
                  
                  {exchange.status === 'pending' && user && exchange.to_user_id === user.id ? (
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleRespond(exchange.id, true)}
                      >
                        <CheckCircle size={16} className="me-1" />
                        ยอมรับ
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRespond(exchange.id, false)}
                      >
                        <XCircle size={16} className="me-1" />
                        ปฏิเสธ
                      </button>
                    </div>
                  ) : exchange.status === 'pending' && user && exchange.from_user_id === user.id ? (
                    <div className="alert alert-info small mb-0">
                      รอการตอบกลับจากผู้ใช้
                    </div>
                  ) : (
                    <div className="alert alert-secondary small mb-0">
                      {exchange.status === 'accepted' ? 'การแลกเปลี่ยนได้รับการยอมรับ' : 'การแลกเปลี่ยนถูกปฏิเสธ'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">สร้างคำขอแลกเปลี่ยนใหม่</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">ฟีเจอร์นี้ต้องการการเชื่อมต่อ Supabase เพื่อสร้างคำขอจริง</p>
                <div className="alert alert-info">
                  กรุณาเพิ่มฟอร์มสำหรับ:
                  <ul className="mb-0 mt-2">
                    <li>หัวข้อคำขอ</li>
                    <li>สิ่งที่เสนอแลกเปลี่ยน</li>
                    <li>สิ่งที่ต้องการได้รับ</li>
                    <li>คำอธิบายเพิ่มเติม</li>
                    <li>รูปภาพ (ถ้ามี)</li>
                    <li>เลือกผู้ใช้ที่ต้องการแลกเปลี่ยนด้วย (ถ้ามี)</li>
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  ยกเลิก
                </button>
                <button type="button" className="btn btn-primary">
                  ส่งคำขอ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exchanges;
