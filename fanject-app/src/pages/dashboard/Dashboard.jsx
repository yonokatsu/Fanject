import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navbar, Footer } from '../layout';
import { User, Heart, Calendar, Bookmark } from 'lucide-react';

function Dashboard() {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      
      <main className="flex-grow-1 container py-4">
        <div className="row">
          {/* Profile Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <User size={40} color="white" />
                </div>
                <h5 className="mb-1">{userProfile?.full_name || user?.email}</h5>
                <p className="text-muted small mb-3">Fan Club Member</p>
                
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <div className="text-center">
                    <strong className="d-block">0</strong>
                    <small className="text-muted">Posts</small>
                  </div>
                  <div className="text-center">
                    <strong className="d-block">0</strong>
                    <small className="text-muted">Following</small>
                  </div>
                  <div className="text-center">
                    <strong className="d-block">0</strong>
                    <small className="text-muted">Followers</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card shadow-sm mt-3">
              <div className="card-body">
                <h6 className="card-title mb-3">Quick Stats</h6>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                      <Heart size={16} className="me-2" />
                      Favorites
                    </span>
                    <span className="badge bg-primary">0</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                      <Calendar size={16} className="me-2" />
                      Events
                    </span>
                    <span className="badge bg-success">0</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                      <Bookmark size={16} className="me-2" />
                      Giveaways
                    </span>
                    <span className="badge bg-warning">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-lg-9">
            {/* Tab Navigation */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'feed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('feed')}
                >
                  Feed
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
                  onClick={() => setActiveTab('activity')}
                >
                  Activity
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            {activeTab === 'feed' && (
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Your Feed</h5>
                  <p className="text-muted">
                    Stay updated with the latest posts from your favorite artists and fan communities.
                  </p>
                  <div className="text-center py-5">
                    <p className="text-muted">No posts yet. Check back later!</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Activity</h5>
                  
                  {/* Activity Sub-tabs */}
                  <div className="mb-4">
                    <ul className="nav nav-pills">
                      <li className="nav-item">
                        <button className="nav-link active">Favorites</button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link">Events Participate</button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link">Giveaways Backup</button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link">Collection</button>
                      </li>
                    </ul>
                  </div>

                  <div className="text-center py-5">
                    <p className="text-muted">No activity yet. Start exploring!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
