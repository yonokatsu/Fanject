import React, { useState, useEffect } from 'react';
import { Gift, Trophy, Clock, Users, Share2, Plus } from 'lucide-react';
import supabase from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const Giveaways = () => {
  const { user } = useAuth();
  const [giveaways, setGiveaways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchGiveaways();
  }, []);

  const fetchGiveaways = async () => {
    try {
      const { data, error } = await supabase
        .from('giveaways')
        .select(`
          *,
          artists (name, image_url),
          creator:users!giveaways_creator_id_fkey (username, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setGiveaways(data || []);
    } catch (error) {
      console.error('Error fetching giveaways:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterGiveaway = async (giveawayId) => {
    if (!user) {
      alert('กรุณาเข้าสู่ระบบเพื่อเข้าร่วม');
      return;
    }

    try {
      const { error } = await supabase
        .from('giveaway_entries')
        .insert({
          giveaway_id: giveawayId,
          user_id: user.id
        });
      
      if (error) throw error;
      alert('เข้าร่วมสำเร็จ! ขอโชคดี!');
      fetchGiveaways();
    } catch (error) {
      console.error('Error entering giveaway:', error);
      alert('เกิดข้อผิดพลาดในการเข้าร่วม');
    }
  };

  const getStatusBadge = (giveaway) => {
    const now = new Date();
    const endDate = new Date(giveaway.end_date);
    
    if (endDate < now) {
      return <span className="badge bg-secondary">สิ้นสุดแล้ว</span>;
    } else if (giveaway.winner_selected) {
      return <span className="badge bg-success">มีผู้ชนะแล้ว</span>;
    } else {
      return <span className="badge bg-primary">เปิดอยู่</span>;
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
          <Gift className="me-2" size={24} />
          ของขวัญสำหรับแฟนคลับ
        </h2>
        {user && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={20} className="me-1" />
            สร้างของขวัญใหม่
          </button>
        )}
      </div>

      {/* Giveaways Grid */}
      {giveaways.length === 0 ? (
        <div className="text-center py-5">
          <Gift size={48} className="text-muted mb-3" />
          <h5 className="text-muted">ยังไม่มีของขวัญ</h5>
          <p className="text-muted">เป็นคนที่สร้างของขวัญแรก!</p>
        </div>
      ) : (
        <div className="row g-4">
          {giveaways.map((giveaway) => (
            <div key={giveaway.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                {giveaway.image_url && (
                  <img 
                    src={giveaway.image_url} 
                    className="card-img-top" 
                    alt={giveaway.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{giveaway.title}</h5>
                    {getStatusBadge(giveaway)}
                  </div>
                  
                  {giveaway.artists && (
                    <p className="text-muted small mb-2">
                      <strong>{giveaway.artists.name}</strong>
                    </p>
                  )}
                  
                  <p className="card-text small text-muted">
                    {giveaway.description}
                  </p>
                  
                  <div className="mb-2">
                    <Clock size={16} className="me-1" />
                    <span className="small">
                      สิ้นสุด: {new Date(giveaway.end_date).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {giveaway.entry_count !== undefined && (
                    <div className="mb-2">
                      <Users size={16} className="me-1" />
                      <span className="small">{giveaway.entry_count} คนเข้าร่วม</span>
                    </div>
                  )}
                  
                  {giveaway.winner_selected && giveaway.winner_id && (
                    <div className="alert alert-success small mb-2">
                      <Trophy size={16} className="me-1" />
                      มีผู้ชนะแล้ว!
                    </div>
                  )}
                  
                  {giveaway.creator && (
                    <div className="mb-3 small text-muted">
                      โดย: {giveaway.creator.username}
                    </div>
                  )}
                  
                  <div className="d-grid gap-2">
                    {!giveaway.winner_selected && new Date(giveaway.end_date) > new Date() ? (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEnterGiveaway(giveaway.id)}
                      >
                        <Gift size={16} className="me-1" />
                        เข้าร่วมตอนนี้
                      </button>
                    ) : (
                      <button className="btn btn-secondary btn-sm" disabled>
                        ปิดการเข้าร่วม
                      </button>
                    )}
                    <button className="btn btn-outline-secondary btn-sm">
                      <Share2 size={16} className="me-1" />
                      แชร์
                    </button>
                  </div>
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
                <h5 className="modal-title">สร้างของขวัญใหม่</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted">ฟีเจอร์นี้ต้องการการเชื่อมต่อ Supabase เพื่อสร้างของขวัญจริง</p>
                <div className="alert alert-info">
                  กรุณาเพิ่มฟอร์มสำหรับ:
                  <ul className="mb-0 mt-2">
                    <li>ชื่อของขวัญ</li>
                    <li>คำอธิบาย</li>
                    <li>รูปภาพ</li>
                    <li>ศิลปินที่เกี่ยวข้อง</li>
                    <li>วันสิ้นสุด</li>
                    <li>เงื่อนไขการเข้าร่วม</li>
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
                  สร้างของขวัญ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Giveaways;
