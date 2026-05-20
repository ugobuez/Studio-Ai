import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Crown, Mic2, Music2, Download } from 'lucide-react';
import { useAuthStore } from '../context/authStore';

const Profile = () => {
  const { user, logout } = useAuthStore();

  const stats = [
    { label: 'Songs Generated', value: 24, icon: Music2 },
    { label: 'Voice Samples', value: 3, icon: Mic2 },
    { label: 'Total Downloads', value: 156, icon: Download },
  ];

  const plan = 'Pro';

  return (
    <div className="profile-page py-5 mt-5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row className="g-4">
            {/* Profile Card */}
            <Col md={4}>
              <Card className="text-center h-100">
                <Card.Body className="p-4">
                  <motion.div
                    className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '120px',
                      height: '120px',
                      background: 'var(--gradient-card)',
                      border: '3px solid var(--color-gold)',
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <User size={48} className="text-gold" />
                  </motion.div>

                  <h4 className="mb-1">{user?.name || 'Music Creator'}</h4>
                  <p className="text-secondary mb-3">{user?.email || 'user@example.com'}</p>

                  <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                    <Crown size={18} className="text-gold" />
                    <span className="text-gold fw-semibold">{plan} Plan</span>
                  </div>

                  <Button variant="outline-light" className="w-100" onClick={logout}>
                    Logout
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Stats Card */}
            <Col md={8}>
              <Card className="h-100">
                <Card.Header>
                  <User size={18} className="me-2 text-gold" />
                  Your Statistics
                </Card.Header>
                <Card.Body>
                  <Row className="g-4 mb-4">
                    {stats.map(({ label, value, icon: Icon }) => (
                      <Col key={label} md={4}>
                        <motion.div
                          className="glass-card p-4 text-center h-100"
                          whileHover={{ y: -4 }}
                        >
                          <Icon size={32} className="text-gold mb-3" />
                          <h2 className="display-heading fs-1 mb-1">{value}</h2>
                          <p className="text-secondary mb-0 small">{label}</p>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>

                  <div className="border-top pt-4">
                    <h5 className="mb-3">Account Details</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <User size={18} className="text-secondary" />
                          <div>
                            <p className="text-secondary small mb-0">Name</p>
                            <p className="mb-0">{user?.name || 'Music Creator'}</p>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <Mail size={18} className="text-secondary" />
                          <div>
                            <p className="text-secondary small mb-0">Email</p>
                            <p className="mb-0">{user?.email || 'user@example.com'}</p>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <Calendar size={18} className="text-secondary" />
                          <div>
                            <p className="text-secondary small mb-0">Member Since</p>
                            <p className="mb-0">January 2024</p>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <Crown size={18} className="text-secondary" />
                          <div>
                            <p className="text-secondary small mb-0">Subscription</p>
                            <p className="mb-0 text-gold">{plan}</p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

export default Profile;
