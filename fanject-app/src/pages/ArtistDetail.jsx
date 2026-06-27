import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Info, Heart, Share2 } from 'lucide-react';
import { supabase } from '../services/supabase';

const ArtistDetail = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);

  const fetchArtistData = async () => {
    try {
      // Fetch artist details
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single();

      if (artistError) throw artistError;
      setArtist(artistData);

      // If group, fetch members
      if (artistData && artistData.type === 'group') {
        const { data: membersData, error: membersError } = await supabase
          .from('artist_members')
          .select(`
            member_id,
            role,
            artists (
              id,
              name,
              image_url,
              origin
            )
          `)
          .eq('group_id', id);

        if (membersError) throw membersError;
        setMembers(membersData || []);
      }

      // Fetch upcoming events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .contains('artist_ids', [id])
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

    } catch (error) {
      console.error('Error fetching artist data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading Artist Profile...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Artist not found.
        </div>
        <Link to="/artists" className="btn btn-primary">Back to Artists</Link>
      </div>
    );
  }

  return (
    <div className="artist-detail-page">
      {/* Hero Section */}
      <div className="bg-light py-5 border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <img 
                src={artist.image_url || 'https://via.placeholder.com/300x300'} 
                className="img-fluid rounded-circle shadow" 
                alt={artist.name}
                style={{maxWidth: '250px', maxHeight: '250px', objectFit: 'cover'}}
              />
            </div>
            <div className="col-md-8">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="mb-2">{artist.name}</h1>
                  <p className="lead text-muted mb-2">
                    <MapPin size={20} className="me-2" />
                    {artist.origin}
                  </p>
                  {artist.type === 'group' && (
                    <span className="badge bg-info fs-6">
                      <Users size={16} className="me-1" />
                      Group Artist
                    </span>
                  )}
                </div>
                <div>
                  <button className="btn btn-outline-primary me-2">
                    <Heart size={20} />
                  </button>
                  <button className="btn btn-outline-secondary">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
              
              {/* Tabs */}
              <ul className="nav nav-tabs mt-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                  >
                    <Info size={18} className="me-2" />
                    Information
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
                    onClick={() => setActiveTab('events')}
                  >
                    <Calendar size={18} className="me-2" />
                    Events ({events.length})
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-4">
        {activeTab === 'info' && (
          <div className="row">
            <div className="col-lg-8">
              <h3 className="mb-3">About</h3>
              <p className="lead">{artist.bio || 'No biography available.'}</p>
              
              {artist.social_links && (
                <div className="mt-4">
                  <h4 className="mb-3">Social Links</h4>
                  <div className="d-flex gap-3">
                    {artist.social_links.twitter && (
                      <a href={artist.social_links.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                        Twitter
                      </a>
                    )}
                    {artist.social_links.instagram && (
                      <a href={artist.social_links.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger">
                        Instagram
                      </a>
                    )}
                    {artist.social_links.facebook && (
                      <a href={artist.social_links.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                        Facebook
                      </a>
                    )}
                    {artist.social_links.youtube && (
                      <a href={artist.social_links.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger">
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Members Section (for groups) */}
            {artist.type === 'group' && members.length > 0 && (
              <div className="col-lg-4">
                <h3 className="mb-3">Members</h3>
                <div className="list-group">
                  {members.map((member, idx) => (
                    <Link 
                      key={idx} 
                      to={`/artists/${member.artists.id}`}
                      className="list-group-item list-group-item-action d-flex align-items-center"
                    >
                      <img 
                        src={member.artists.image_url || 'https://via.placeholder.com/50'} 
                        className="rounded-circle me-3" 
                        alt={member.artists.name}
                        style={{width: '50px', height: '50px', objectFit: 'cover'}}
                      />
                      <div>
                        <h6 className="mb-0">{member.artists.name}</h6>
                        <small className="text-muted">{member.role || 'Member'}</small>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h3 className="mb-4">Upcoming Events</h3>
            {events.length > 0 ? (
              <div className="row g-4">
                {events.map((event) => (
                  <div key={event.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <img 
                        src={event.image_url || 'https://via.placeholder.com/400x200'} 
                        className="card-img-top" 
                        alt={event.title}
                        style={{height: '180px', objectFit: 'cover'}}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{event.title}</h5>
                        <p className="card-text text-muted small mb-2">
                          <Calendar size={14} className="me-1" />
                          {new Date(event.start_time).toLocaleDateString()}
                        </p>
                        <p className="card-text text-muted small mb-2">
                          <MapPin size={14} className="me-1" />
                          {event.venue}
                        </p>
                        <Link to={`/events/${event.id}`} className="btn btn-primary btn-sm">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">
                No upcoming events scheduled for this artist.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail;
