import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, Calendar, MapPin, Heart, Share2 } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const Discover = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileSheet, setShowProfileSheet] = useState(false);

  // Generate next 7 days for calendar strip
  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Fetch user interests and smart content
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch user interests from profile
        const { data: profile, error } = await supabase
          .from('users')
          .select('favorite_artists, origins, event_types')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setUserInterests({
            artists: profile.favorite_artists || [],
            origins: profile.origins || [],
            eventTypes: profile.event_types || []
          });
        }

        // Fetch artists based on interests (cold-start logic)
        let artistQuery = supabase.from('artists').select('*').limit(12);
        
        if (profile?.favorite_artists?.length > 0) {
          artistQuery = artistQuery.in('name', profile.favorite_artists);
        }

        const { data: artistsData, error: artistsError } = await artistQuery;
        if (artistsError) throw artistsError;
        setArtists(artistsData || []);

      } catch (error) {
        console.error('Error fetching discover data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, selectedDate]);

  const fetchEvents = async (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select(`
          *,
          artists (
            id,
            name,
            image_url,
            origin
          )
        `)
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(eventsData || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    fetchEvents(date);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', searchQuery);
  };

  const toggleProfileSheet = () => {
    setShowProfileSheet(!showProfileSheet);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading Discover...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="discover-page">
      {/* Top Navigation */}
      <nav className="navbar navbar-light bg-white border-bottom sticky-top">
        <div className="container-fluid">
          <div className="d-flex align-items-center flex-grow-1">
            <button 
              className="btn btn-link me-2 p-0" 
              onClick={toggleProfileSheet}
              aria-label="Profile menu"
            >
              <Menu size={24} />
            </button>
            
            <form onSubmit={handleSearch} className="flex-grow-1 mx-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search artists, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-outline-primary" type="submit">
                  <Search size={18} />
                </button>
              </div>
            </form>

            <button className="btn btn-link position-relative me-2" aria-label="Notifications">
              <Bell size={24} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
                3
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Sheet (Collapsible) */}
      {showProfileSheet && (
        <div className="profile-sheet position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-index-1000" onClick={toggleProfileSheet}>
          <div className="bg-white position-absolute bottom-0 start-0 w-100 rounded-top p-4" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Profile</h5>
              <button className="btn-close" onClick={toggleProfileSheet}></button>
            </div>
            <div className="text-center">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-2" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <h6>{user?.email}</h6>
              <a href="/dashboard" className="btn btn-outline-primary btn-sm mt-2">Go to Dashboard</a>
            </div>
          </div>
        </div>
      )}

      <div className="container py-4">
        {/* Artists Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Featured Artists</h4>
            <a href="/artists" className="btn btn-link p-0">See All</a>
          </div>
          
          <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-3">
            {artists.length > 0 ? (
              artists.map((artist) => (
                <div key={artist.id} className="col">
                  <div className="card h-100 border-0 shadow-sm artist-card">
                    <img 
                      src={artist.image_url || 'https://via.placeholder.com/150'} 
                      className="card-img-top" 
                      alt={artist.name}
                      style={{height: '120px', objectFit: 'cover'}}
                    />
                    <div className="card-body p-2 text-center">
                      <h6 className="card-title mb-1 text-truncate">{artist.name}</h6>
                      <p className="card-text small text-muted mb-0">{artist.origin}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-info">
                  No artists found. Complete your onboarding to see personalized recommendations!
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Events Section with Calendar Strip */}
        <section>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Upcoming Events</h4>
            <div className="dropdown">
              <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <MapPin size={16} className="me-1" />
                Filter by Location
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">All Locations</a></li>
                <li><a className="dropdown-item" href="#">Bangkok</a></li>
                <li><a className="dropdown-item" href="#">Chiang Mai</a></li>
                <li><a className="dropdown-item" href="#">Phuket</a></li>
              </ul>
            </div>
          </div>

          {/* 7-Day Calendar Strip */}
          <div className="calendar-strip d-flex overflow-auto mb-4 pb-2">
            {calendarDays.map((date, index) => (
              <button
                key={index}
                className={`calendar-day btn flex-shrink-0 mx-1 ${
                  isSelected(date) ? 'btn-primary' : 'btn-outline-primary'
                } ${isToday(date) ? 'today-indicator' : ''}`}
                onClick={() => handleDateSelect(date)}
                style={{minWidth: '80px'}}
              >
                <div className="d-flex flex-column align-items-center">
                  <span className="small">{formatDate(date).split(' ')[0]}</span>
                  <span className="fs-5 fw-bold">{formatDate(date).split(' ')[1]}</span>
                  {isToday(date) && <span className="badge bg-warning text-dark mt-1">Today</span>}
                </div>
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="row g-4">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm event-card">
                    <div className="position-relative">
                      <img 
                        src={event.image_url || 'https://via.placeholder.com/400x200'} 
                        className="card-img-top" 
                        alt={event.title}
                        style={{height: '200px', objectFit: 'cover'}}
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <button className="btn btn-light btn-sm rounded-circle">
                          <Heart size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{event.title}</h5>
                      <p className="card-text text-muted small">
                        <Calendar size={14} className="me-1" />
                        {new Date(event.start_time).toLocaleDateString()}
                      </p>
                      <p className="card-text text-muted small">
                        <MapPin size={14} className="me-1" />
                        {event.venue}
                      </p>
                      {event.artists && event.artists.length > 0 && (
                        <div className="mb-2">
                          {event.artists.map((artist, idx) => (
                            <span key={idx} className="badge bg-secondary me-1">{artist.name}</span>
                          ))}
                        </div>
                      )}
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="badge bg-success">{event.status}</span>
                        <div>
                          <button className="btn btn-outline-primary btn-sm me-1">
                            <Share2 size={16} />
                          </button>
                          <button className="btn btn-primary btn-sm">Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-info">
                  No events scheduled for {selectedDate.toLocaleDateString()}. Check another date!
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Bottom Navigation Spacer */}
      <div style={{height: '60px'}}></div>
    </div>
  );
};

export default Discover;
