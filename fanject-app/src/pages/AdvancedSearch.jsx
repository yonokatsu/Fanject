import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Clock, MapPin, Music, User, Calendar } from 'lucide-react';
import './AdvancedSearch.css';

const AdvancedSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, artists, events, users
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: '',
    location: '',
    origin: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState({
    artists: [],
    events: [],
    users: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // โหลดประวัติการค้นหาจาก localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // จำลองข้อมูลคำแนะนำ
  useEffect(() => {
    if (searchQuery.length > 1) {
      const mockSuggestions = [
        { id: 1, text: 'Taylor Swift', type: 'artist' },
        { id: 2, text: 'Taylor Swift - Eras Tour', type: 'event' },
        { id: 3, text: 'Taylor Fan Club', type: 'user' },
        { id: 4, text: 'Taeyeon', type: 'artist' },
        { id: 5, text: 'Taipei Concert', type: 'event' }
      ];
      setSuggestions(
        mockSuggestions.filter(s => 
          s.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // จำลองการค้นหา
  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);

    // บันทึกประวัติการค้นหา
    const newHistory = [
      { query: searchQuery, timestamp: new Date().toISOString() },
      ...searchHistory.filter(h => h.query !== searchQuery)
    ].slice(0, 10);
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // จำลอง API call
    setTimeout(() => {
      setResults({
        artists: [
          { id: 1, name: searchQuery, genre: 'Pop', image: 'https://via.placeholder.com/80' },
          { id: 2, name: `${searchQuery} Band`, genre: 'Rock', image: 'https://via.placeholder.com/80' }
        ],
        events: [
          { 
            id: 1, 
            title: `${searchQuery} World Tour`, 
            date: '2025-06-15', 
            venue: 'Bangkok Arena',
            image: 'https://via.placeholder.com/120x80'
          },
          { 
            id: 2, 
            title: `${searchQuery} Meet & Greet`, 
            date: '2025-07-20', 
            venue: 'Siam Paragon',
            image: 'https://via.placeholder.com/120x80'
          }
        ],
        users: [
          { id: 1, username: `${searchQuery}Fan`, followers: 1234, avatar: 'https://via.placeholder.com/40' },
          { id: 2, username: `${searchQuery}Official`, followers: 5678, avatar: 'https://via.placeholder.com/40' }
        ]
      });
      setIsLoading(false);
    }, 800);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setSuggestions([]);
    performSearch();
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      dateFrom: '',
      dateTo: '',
      location: '',
      origin: ''
    });
  };

  const applyFilters = () => {
    // จำลองการกรองผลลัพธ์
    console.log('Applying filters:', filters);
    setShowFilters(false);
    performSearch();
  };

  return (
    <div className="advanced-search-page">
      {/* Header */}
      <div className="search-header">
        <h2 className="page-title">ค้นหาขั้นสูง</h2>
        
        {/* Search Bar */}
        <div className="search-bar-container position-relative">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <Search size={20} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="ค้นหาศิลปิน, กิจกรรม, หรือผู้ใช้..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              onFocus={() => searchQuery.length > 1 && setSuggestions(suggestions)}
              onBlur={() => setTimeout(() => setSuggestions([]), 200)}
            />
            {searchQuery && (
              <button 
                className="btn btn-link text-muted"
                onClick={() => setSearchQuery('')}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="suggestions-dropdown card shadow-sm">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.type === 'artist' && <Music size={16} />}
                  {suggestion.type === 'event' && <Calendar size={16} />}
                  {suggestion.type === 'user' && <User size={16} />}
                  <span>{suggestion.text}</span>
                  <span className="badge bg-secondary ms-auto">{suggestion.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          className={`btn btn-outline-primary mt-3 ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} className="me-2" />
          ตัวกรอง
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel card shadow-sm mb-4 animate-fade-in">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">ตัวกรองการค้นหา</h5>
            <button className="btn btn-sm btn-link" onClick={clearFilters}>
              ล้างทั้งหมด
            </button>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">หมวดหมู่</label>
                <select
                  className="form-select"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">ทั้งหมด</option>
                  <option value="pop">Pop</option>
                  <option value="rock">Rock</option>
                  <option value="hiphop">Hip-Hop</option>
                  <option value="electronic">Electronic</option>
                  <option value="indie">Indie</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">ต้นกำเนิด</label>
                <select
                  className="form-select"
                  value={filters.origin}
                  onChange={(e) => setFilters({...filters, origin: e.target.value})}
                >
                  <option value="">ทั้งหมด</option>
                  <option value="thailand">ไทย</option>
                  <option value="korea">เกาหลี</option>
                  <option value="usa">สหรัฐอเมริกา</option>
                  <option value="uk">สหราชอาณาจักร</option>
                  <option value="japan">ญี่ปุ่น</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">วันที่เริ่มต้น</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">วันที่สิ้นสุด</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">สถานที่</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <MapPin size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="กรุงเทพมหานคร, เชียงใหม่, ..."
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="col-md-6 d-flex align-items-end">
                <button className="btn btn-primary w-100" onClick={applyFilters}>
                  ใช้ตัวกรอง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search History */}
      {searchHistory.length > 0 && !searchQuery && (
        <div className="search-history card shadow-sm mb-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <Clock size={18} className="me-2" />
              ประวัติการค้นหา
            </h5>
            <button className="btn btn-sm btn-link text-danger" onClick={clearHistory}>
              ลบประวัติ
            </button>
          </div>
          <div className="card-body">
            <div className="d-flex flex-wrap gap-2">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setSearchQuery(item.query)}
                >
                  {item.query}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Tabs */}
      <div className="results-section">
        <ul className="nav nav-tabs mb-3" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              ทั้งหมด
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'artists' ? 'active' : ''}`}
              onClick={() => setActiveTab('artists')}
            >
              ศิลปิน
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              กิจกรรม
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              ผู้ใช้
            </button>
          </li>
        </ul>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">กำลังโหลด...</span>
            </div>
            <p className="mt-2 text-muted">กำลังค้นหา...</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchQuery && results.artists.length === 0 && 
         results.events.length === 0 && results.users.length === 0 && (
          <div className="text-center py-5">
            <Search size={48} className="text-muted mb-3" />
            <h5>ไม่พบผลลัพธ์</h5>
            <p className="text-muted">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
          </div>
        )}

        {/* Results Content */}
        {!isLoading && (
          <div className="results-content">
            {/* Artists Results */}
            {(activeTab === 'all' || activeTab === 'artists') && results.artists.length > 0 && (
              <div className="results-category mb-4">
                <h4 className="category-title mb-3">
                  <Music size={20} className="me-2" />
                  ศิลปิน
                </h4>
                <div className="row g-3">
                  {results.artists.map((artist) => (
                    <div key={artist.id} className="col-6 col-md-4 col-lg-3">
                      <div className="card artist-card h-100">
                        <img 
                          src={artist.image} 
                          className="card-img-top" 
                          alt={artist.name}
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                        <div className="card-body p-2">
                          <h6 className="card-title mb-1">{artist.name}</h6>
                          <p className="card-text small text-muted">{artist.genre}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Results */}
            {(activeTab === 'all' || activeTab === 'events') && results.events.length > 0 && (
              <div className="results-category mb-4">
                <h4 className="category-title mb-3">
                  <Calendar size={20} className="me-2" />
                  กิจกรรม
                </h4>
                <div className="list-group">
                  {results.events.map((event) => (
                    <div key={event.id} className="list-group-item list-group-item-action">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="rounded"
                            style={{ width: '120px', height: '80px', objectFit: 'cover' }}
                          />
                          <div>
                            <h6 className="mb-1">{event.title}</h6>
                            <p className="mb-1 small text-muted">
                              <Calendar size={14} className="me-1" />
                              {new Date(event.date).toLocaleDateString('th-TH')}
                            </p>
                            <p className="mb-0 small text-muted">
                              <MapPin size={14} className="me-1" />
                              {event.venue}
                            </p>
                          </div>
                        </div>
                        <button className="btn btn-sm btn-outline-primary">
                          ดูรายละเอียด
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Results */}
            {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
              <div className="results-category mb-4">
                <h4 className="category-title mb-3">
                  <User size={20} className="me-2" />
                  ผู้ใช้
                </h4>
                <div className="list-group">
                  {results.users.map((user) => (
                    <div key={user.id} className="list-group-item list-group-item-action">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={user.avatar} 
                            alt={user.username}
                            className="rounded-circle"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                          <div>
                            <h6 className="mb-1">@{user.username}</h6>
                            <p className="mb-0 small text-muted">
                              ผู้ติดตาม: {user.followers.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button className="btn btn-sm btn-outline-primary">
                          ติดตาม
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
