import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Share2, CheckCircle } from 'lucide-react';
import supabase from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'

  useEffect(() => {
    fetchEvents();
  }, [selectedDate, viewMode]);

  const fetchEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          artists (name, image_url),
          venue (name, address, city)
        `)
        .order('start_date', { ascending: true });

      if (viewMode === 'week') {
        const weekStart = new Date(selectedDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        query = query.gte('start_date', weekStart.toISOString()).lte('start_date', weekEnd.toISOString());
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: user.id,
          status: 'going'
        });
      
      if (error) throw error;
      alert('RSVP สำเร็จ!');
      fetchEvents();
    } catch (error) {
      console.error('Error RSVP:', error);
      alert('เกิดข้อผิดพลาดในการ RSVP');
    }
  };

  const getWeekDates = () => {
    const dates = [];
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('th-TH', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
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

  const weekDates = getWeekDates();

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <Calendar className="me-2" size={24} />
          กิจกรรม
        </h2>
        <div className="btn-group">
          <button
            className={`btn ${viewMode === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('week')}
          >
            สัปดาห์
          </button>
          <button
            className={`btn ${viewMode === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('month')}
          >
            เดือน
          </button>
        </div>
      </div>

      {/* Week Calendar Strip */}
      {viewMode === 'week' && (
        <div className="row g-2 mb-4">
          {weekDates.map((date, index) => (
            <div key={index} className="col">
              <div
                className={`p-2 text-center rounded cursor-pointer transition-all ${
                  isToday(date) ? 'bg-primary text-white' : 
                  selectedDate.toDateString() === date.toDateString() 
                    ? 'bg-light border border-primary' 
                    : 'bg-light'
                }`}
                onClick={() => setSelectedDate(date)}
                style={{ cursor: 'pointer' }}
              >
                <div className="small">{date.toLocaleDateString('th-TH', { weekday: 'short' })}</div>
                <div className="fw-bold">{date.getDate()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-5">
          <Calendar size={48} className="text-muted mb-3" />
          <h5 className="text-muted">ไม่มีกิจกรรมในช่วงเวลานี้</h5>
          <p className="text-muted">ลองเปลี่ยนวันที่หรือดูกิจกรรมอื่นๆ</p>
        </div>
      ) : (
        <div className="row g-4">
          {events.map((event) => (
            <div key={event.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                {event.image_url && (
                  <img 
                    src={event.image_url} 
                    className="card-img-top" 
                    alt={event.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  
                  {event.artists && (
                    <p className="text-muted small mb-2">
                      <strong>{event.artists.name}</strong>
                    </p>
                  )}
                  
                  <div className="mb-2">
                    <Calendar size={16} className="me-1" />
                    <span className="small">
                      {new Date(event.start_date).toLocaleDateString('th-TH', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <Clock size={16} className="me-1" />
                    <span className="small">
                      {new Date(event.start_date).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {event.venue && (
                    <div className="mb-2">
                      <MapPin size={16} className="me-1" />
                      <span className="small">
                        {event.venue.name}, {event.venue.city}
                      </span>
                    </div>
                  )}
                  
                  {event.attendee_count !== undefined && (
                    <div className="mb-3">
                      <Users size={16} className="me-1" />
                      <span className="small">{event.attendee_count} คนสนใจ</span>
                    </div>
                  )}
                  
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleRSVP(event.id)}
                    >
                      <CheckCircle size={16} className="me-1" />
                      RSVP
                    </button>
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
    </div>
  );
};

export default Events;
