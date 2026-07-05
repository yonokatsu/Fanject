import React, { useState, useEffect } from 'react';
import { Bookmark, Calendar, Gift, MessageSquare, Search, Filter, Trash2, ExternalLink, FolderPlus, Edit2, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import './Bookmarks.css';

const Bookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
      fetchFolders();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          post:posts(id, title, content, image_url),
          event:events(id, title, artist_name, venue, event_date),
          giveaway:giveaways(id, title, artist_name, end_date)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
      setFilteredBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmark_folders')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setFolders(data || [{ id: 'all', name: 'ทั้งหมด', is_default: true }]);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    if (!window.confirm('ต้องการลบบุ๊กมาร์กนี้หรือไม่?')) return;

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
      setFilteredBookmarks(filteredBookmarks.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('bookmark_folders')
        .insert([{
          user_id: user.id,
          name: newFolderName.trim(),
          is_default: false
        }])
        .select();

      if (error) throw error;
      setFolders([...folders, data[0]]);
      setNewFolderName('');
      setShowCreateFolder(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('เกิดข้อผิดพลาดในการสร้างโฟลเดอร์');
    }
  };

  const handleMoveToFolder = async (bookmarkId, folderId) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .update({ folder_id: folderId })
        .eq('id', bookmarkId);

      if (error) throw error;
      fetchBookmarks();
    } catch (error) {
      console.error('Error moving bookmark:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'post': return <MessageSquare size={18} />;
      case 'event': return <Calendar size={18} />;
      case 'giveaway': return <Gift size={18} />;
      default: return <Bookmark size={18} />;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      post: 'โพสต์',
      event: 'กิจกรรม',
      giveaway: 'ของขวัญ'
    };
    return labels[type] || type;
  };

  const getFilteredData = () => {
    let filtered = bookmarks;

    // กรองตามโฟลเดอร์
    if (activeFilter !== 'all') {
      filtered = filtered.filter(b => b.folder_id === activeFilter);
    }

    // ค้นหา
    if (searchQuery) {
      filtered = filtered.filter(b => {
        const item = b.post || b.event || b.giveaway;
        return item && item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    return filtered;
  };

  useEffect(() => {
    setFilteredBookmarks(getFilteredData());
  }, [activeFilter, searchQuery, bookmarks]);

  if (loading) {
    return (
      <div className="bookmarks-container">
        <div className="loading-spinner">กำลังโหลดบุ๊กมาร์ก...</div>
      </div>
    );
  }

  return (
    <div className="bookmarks-container">
      <div className="bookmarks-header">
        <h2><Bookmark size={24} /> บุ๊กมาร์กของฉัน</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateFolder(!showCreateFolder)}
        >
          <FolderPlus size={18} /> สร้างโฟลเดอร์
        </button>
      </div>

      {showCreateFolder && (
        <div className="create-folder-form card p-3 mb-3">
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="ชื่อโฟลเดอร์ใหม่..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <button className="btn btn-success" onClick={handleCreateFolder}>
              <Check size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => setShowCreateFolder(false)}>
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      <div className="bookmarks-controls mb-3">
        <div className="search-box position-relative">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="ค้นหาบุ๊กมาร์ก..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-buttons d-flex flex-wrap gap-2 mt-2">
          {folders.map(folder => (
            <button
              key={folder.id}
              className={`btn ${activeFilter === folder.id ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
              onClick={() => setActiveFilter(folder.id)}
            >
              {folder.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bookmarks-stats mb-3 text-muted">
        พบ {filteredBookmarks.length} รายการ จากทั้งหมด {bookmarks.length} รายการ
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="empty-state text-center py-5">
          <Bookmark size={64} className="text-muted mb-3" />
          <h5>ยังไม่มีบุ๊กมาร์ก</h5>
          <p className="text-muted">บันทึกโพสต์ กิจกรรม หรือของขวัญที่คุณสนใจได้ที่นี่</p>
        </div>
      ) : (
        <div className="bookmarks-grid">
          {filteredBookmarks.map(bookmark => {
            const item = bookmark.post || bookmark.event || bookmark.giveaway;
            if (!item) return null;

            return (
              <div key={bookmark.id} className="bookmark-card card">
                <div className="card-body">
                  <div className="bookmark-header d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="type-icon">{getTypeIcon(bookmark.type)}</span>
                      <span className="badge bg-secondary">{getTypeLabel(bookmark.type)}</span>
                    </div>
                    <div className="dropdown">
                      <button className="btn btn-sm btn-link" data-bs-toggle="dropdown">
                        <Filter size={16} />
                      </button>
                      <ul className="dropdown-menu">
                        {folders.filter(f => !f.is_default).map(folder => (
                          <li key={folder.id}>
                            <button
                              className="dropdown-item"
                              onClick={() => handleMoveToFolder(bookmark.id, folder.id)}
                            >
                              ย้ายไป "{folder.name}"
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <h5 className="card-title">{item.title}</h5>
                  
                  {item.content && (
                    <p className="card-text text-muted small">
                      {item.content.substring(0, 100)}...
                    </p>
                  )}
                  
                  {item.artist_name && (
                    <p className="text-primary small mb-1">
                      🎤 {item.artist_name}
                    </p>
                  )}
                  
                  {item.venue && (
                    <p className="text-muted small mb-1">
                      📍 {item.venue}
                    </p>
                  )}
                  
                  {(item.event_date || item.end_date) && (
                    <p className="text-muted small mb-2">
                      📅 {item.event_date || item.end_date}
                    </p>
                  )}

                  <div className="bookmark-footer d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      บันทึกเมื่อ: {new Date(bookmark.created_at).toLocaleDateString('th-TH')}
                    </small>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary">
                        <ExternalLink size={14} /> ดูรายละเอียด
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
