import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { 
  Sparkles, Mic2, AudioLines, Download, 
  ChevronRight, Waveform 
} from 'lucide-react';
import { useAuthStore } from '../context/authStore';

const FloatingNotes = () => {
  const notes = ['♪', '♫', '♬', '♩', '♭', '♯'];
  
  return (
    <div className="position-absolute w-100 h-100 overflow-hidden pointer-events-none">
      {notes.map((note, i) => (
        <div
          key={i}
          className="music-note"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-50px',
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
            fontSize: `${1.5 + Math.random() * 1.5}rem`,
          }}
        >
          {note}
        </div>
      ))}
    </div>
  );
};

const HeroWaveform = () => {
  const bars = Array.from({ length: 40 }, (_, i) => ({
    height: 20 + Math.sin(i * 0.5) * 30 + Math.random() * 20,
    delay: i * 0.05,
  }));

  return (
    <div className="d-flex align-items-end justify-content-center gap-1 h-100">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="hero-bar"
          style={{ height: `${bar.height}%` }}
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: bar.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const features = [
  {
    icon: Mic2,
    title: 'Voice Cloning',
    description: 'Upload your voice sample and generate music with your unique vocal timbre',
  },
  {
    icon: AudioLines,
    title: 'Multi-Genre Control',
    description: 'Afrobeat, Amapiano, Afropop, Pop, R&B and more with precise genre control',
  },
  {
    icon: Sparkles,
    title: 'AI Mastering',
    description: 'Professional studio-quality mastering to Apple Music standards',
  },
  {
    icon: Download,
    title: 'Instant Download',
    description: 'Export in WAV 24-bit or MP3 320kbps ready for distribution',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Home = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="home-page">
      <FloatingNotes />
      
      {/* Hero Section */}
      <section className="hero-section min-vh-100 d-flex align-items-center position-relative pt-5 pt-lg-0">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="display-heading mb-4">
                  Generate World-Class<br />
                  Music with AI
                </h1>
                <p className="lead text-gold mb-4 fs-4 fw-semibold">
                  Afrobeat • Amapiano • Afropop • Apple Music Quality
                </p>
                <p className="text-secondary mb-5" style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                  Create professional-grade music in seconds. Our AI generates 
                  authentic Afrobeat and global genre tracks mastered to 
                  Spotify and Apple Music distribution standards.
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="d-inline-block"
                >
                  <Link to={isAuthenticated ? '/generate' : '/auth'}>
                    <Button variant="primary" size="lg" className="cta-pulse px-5 py-3">
                      <Sparkles size={20} className="me-2" />
                      Start Creating
                      <ChevronRight size={20} className="ms-2" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </Col>
            
            <Col lg={6} className="mt-5 mt-lg-0">
              <motion.div
                className="waveform-container h-100"
                style={{ minHeight: '300px' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <HeroWaveform />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 my-5">
        <Container>
          <motion.div
            className="text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="display-heading fs-1 mb-3">Powerful AI Music Tools</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
              Everything you need to create professional music, from voice cloning 
              to final mastering, all powered by self-hosted AI models.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Row className="g-4">
              {features.map(({ icon: Icon, title, description }) => (
                <Col key={title} md={6} lg={3}>
                  <motion.div variants={itemVariants}>
                    <div className="feature-card h-100">
                      <div className="feature-icon">
                        <Icon size={28} />
                      </div>
                      <h5 className="mb-3">{title}</h5>
                      <p className="text-secondary mb-0 small">{description}</p>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 my-5">
        <Container>
          <motion.div
            className="glass-card p-5 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="display-heading fs-2 mb-4">Ready to Create?</h2>
            <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '500px' }}>
              Join thousands of music creators using BeatForge AI to generate 
              professional tracks in seconds.
            </p>
            <Link to={isAuthenticated ? '/generate' : '/auth'}>
              <Button variant="primary" size="lg" className="gradient-animate px-4">
                <Sparkles size={18} className="me-2" />
                Generate Your First Track
              </Button>
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* Footer Spacer */}
      <div style={{ height: '100px' }} />
    </div>
  );
};

export default Home;
