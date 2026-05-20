import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Music, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register, isLoading, error: authError, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    clearError();

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      if (!name.trim()) {
        setError('Name is required');
        return;
      }
      result = await register(name, email, password);
    }

    if (result) {
      setSuccess(isLogin ? 'Welcome back!' : 'Account created successfully!');
      setTimeout(() => navigate('/generate'), 1000);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    clearError();
  };

  return (
    <div className="auth-page min-vh-100 d-flex align-items-center py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={5} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="text-center">
                <Card.Body className="p-4 p-md-5">
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                  >
                    <Music size={48} className="text-gold" />
                  </motion.div>
                  
                  <h2 className="display-heading fs-3 mb-2">
                    {isLogin ? 'Welcome Back' : 'Join BeatForge'}
                  </h2>
                  <p className="text-secondary mb-4">
                    {isLogin 
                      ? 'Sign in to continue creating' 
                      : 'Create your free account'}
                  </p>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert variant="danger" className="d-flex align-items-center gap-2 py-2">
                        <AlertCircle size={18} />
                        {error}
                      </Alert>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert variant="success" className="d-flex align-items-center gap-2 py-2">
                        <CheckCircle size={18} />
                        {success}
                      </Alert>
                    </motion.div>
                  )}

                  {authError && (
                    <Alert variant="danger" className="d-flex align-items-center gap-2 py-2">
                      <AlertCircle size={18} />
                      {authError}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {!isLogin && (
                      <Form.Group className="mb-3">
                        <Form.Label className="text-start w-100">Name</Form.Label>
                        <div className="position-relative">
                          <User size={18} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary" />
                          <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="ps-5"
                          />
                        </div>
                      </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label className="text-start w-100">Email</Form.Label>
                      <div className="position-relative">
                        <Mail size={18} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary" />
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="ps-5"
                          required
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="text-start w-100">Password</Form.Label>
                      <div className="position-relative">
                        <Lock size={18} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary" />
                        <Form.Control
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="ps-5"
                          required
                        />
                      </div>
                    </Form.Group>

                    {!isLogin && (
                      <Form.Group className="mb-4">
                        <Form.Label className="text-start w-100">Confirm Password</Form.Label>
                        <div className="position-relative">
                          <Lock size={18} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-secondary" />
                          <Form.Control
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="ps-5"
                            required
                          />
                        </div>
                      </Form.Group>
                    )}

                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 py-2 mb-3"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="spinner me-2" />
                        ) : null}
                        {isLogin ? 'Sign In' : 'Create Account'}
                      </Button>
                    </motion.div>
                  </Form>

                  <div className="mt-4">
                    <p className="text-secondary mb-0">
                      {isLogin ? "Don't have an account?" : 'Already have an account?'}
                      <button
                        type="button"
                        className="btn btn-link text-gold p-0 ms-1"
                        onClick={switchMode}
                      >
                        {isLogin ? 'Sign up' : 'Sign in'}
                      </button>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auth;
