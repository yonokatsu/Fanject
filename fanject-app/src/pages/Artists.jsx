import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Heart, Share2 } from 'lucide-react';
import { supabase } from '../services/supabase';

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOrigin, setFilterOrigin] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchArtists = async () => {
    try {
      let query = supabase.from('artists').select('*');
      
      if (filterOrigin !== 'all') {
        query = query.eq('origin', filterOrigin);
      }

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query.order('name');
      
      if (error) throw error;
      setArtists(data || []);
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const origins = ['all', ...new Set(artists.map(a => a.origin))];

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading Artists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="artists-page">
      {/* Header */}
      <div className="bg-light py-4 border-bottom">
        <div className="container">
          <h1 className="mb-3">Artists Directory</h1>
          
          {/* Search and Filter */}
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchArtists()}
                />
                <button className="btn btn-primary" onClick={fetchArtists}>
                  Search
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <select 
                className="form-select" 
                value={filterOrigin}
                onChange={(e) => {
                  setFilterOrigin(e.target.value);
                  setTimeout(fetchArtists, 100);
                }}
              >
                {origins.map(origin => (
                  <option key={origin} value={origin}>
                    {origin === 'all' ? 'All Origins' : origin}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="container py-4">
        {artists.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {artists.map((artist) => (
              <div key={artist.id} className="col">
                <ArtistCard artist={artist} />
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            No artists found. Try adjusting your search or filter.
          </div>
        )}
      </div>
    </div>
  );
};

const ArtistCard = ({ artist }) => {
  const isGroup = artist.type === 'group';

  return (
    <div className="card h-100 border-0 shadow-sm artist-card">
      <div className="position-relative">
        <img 
          src={artist.image_url || 'https://via.placeholder.com/300x300'} 
          className="card-img-top" 
          alt={artist.name}
          style={{height: '250px', objectFit: 'cover'}}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <button className="btn btn-light btn-sm rounded-circle">
            <Heart size={18} />
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{artist.name}</h5>
          {isGroup && (
            <span className="badge bg-info">
              <Users size={12} className="me-1" />
              Group
            </span>
          )}
        </div>
        <p className="card-text text-muted small mb-2">
          <MapPin size={14} className="me-1" />
          {artist.origin}
        </p>
        <p className="card-text small">
          {artist.bio ? `${artist.bio.substring(0, 80)}...` : 'No description available'}
        </p>
        <div className="d-grid gap-2">
          <Link to={`/artists/${artist.id}`} className="btn btn-primary btn-sm">
            View Profile
          </Link>
          <button className="btn btn-outline-secondary btn-sm">
            <Share2 size={16} className="me-1" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default Artists;
