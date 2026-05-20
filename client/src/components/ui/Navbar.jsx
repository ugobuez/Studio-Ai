import React from 'react';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, Home, Sparkles, Library, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../context/authStore';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/generate', label: 'Generate', icon: Sparkles },
    { path: '/library', label: 'Library', icon: Library },
  ];

  return (
    <BSNavbar expand="lg" fixed="top" className="navbar">
      <Container>
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <Music size={28} className="text-gold" />
          </motion.div>
          BeatForge AI
        </Link>

        <BSNavbar.Toggle aria-controls="navbarNav" />

        <BSNavbar.Collapse id="navbarNav">
          <Nav className="mx-auto">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link d-flex align-items-center gap-2 ${
                  location.pathname === path ? 'active' : ''
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </Nav>

          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="nav-link d-flex align-items-center gap-2">
                  <User size={18} />
                  Profile
                </Link>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
