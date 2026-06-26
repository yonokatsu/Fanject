import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Search, Bell, MessageSquare, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

function Navbar() {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Fanject
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${showMobileMenu ? 'show' : ''}`}>
          {user && (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    <Home size={18} className="me-1" />
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/discover">
                    <Search size={18} className="me-1" />
                    Discover
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/artists">
                    Artists
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/events">
                    Events
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/giveaways">
                    Giveaways
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/exchanges">
                    Exchanges
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/messages">
                    <MessageSquare size={18} className="me-1" />
                    Messages
                  </Link>
                </li>
              </ul>

              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/notifications">
                    <Bell size={18} />
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <UserIcon size={18} />
                    <span className="d-none d-lg-inline">
                      {userProfile?.full_name || user.email}
                    </span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/settings">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleSignOut}>
                        <LogOut size={16} className="me-2" />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-light py-4 mt-auto">
      <div className="container text-center">
        <p className="text-muted mb-0">
          &copy; {new Date().getFullYear()} Fanject. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export { Navbar, Footer };
