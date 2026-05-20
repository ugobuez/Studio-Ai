import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Play, Pause, Download, Trash2, MoreVertical,
  Filter, Music2, Clock, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSongs } from '../hooks/useApi';

const MOOD_COLORS = {
  Energetic: '#f7971e',
  Melodic: '#ffd200',
  Chill: '#4facfe',
  Sad: '#667eea',
  Romantic: '#f093fb',
  Uplifting: '#2ECC71',
  Dark: '#1a1a2e',
};

const Library = () => {
  const { songs, isLoading, error, fetchSongs, deleteSong } = useSongs();
  const [playingId, setPlayingId] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const filteredSongs = filter === 'All' 
    ? songs 
    : songs.filter(s => s.genre === filter || s.mood === filter);

  const genres = ['All', ...new Set(songs.map(s => s.genre).filter(Boolean))];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this track?')) {
      try {
        await deleteSong(id);
        toast.success('Track deleted');
      } catch (err) {
        toast.error('Failed to delete track');
      }
    }
  };

  const handleDownload = async (song) => {
    if (song.audioUrl) {
      const link = document.createElement('a');
      link.href = song.audioUrl;
      link.download = `${song.title || 'beatforge-track'}.wav`;
      link.click();
      toast.success('Download started');
    }
  };

  return (
    <div className="library-page py-5 mt-5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="display-heading fs-2 mb-0">Your Library</h1>
            <Dropdown>
              <Dropdown.Toggle variant="outline-light" id="filter-dropdown">
                <Filter size={16} className="me-2" />
                {filter}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {genres.map((g) => (
                  <Dropdown.Item key={g} onClick={() => setFilter(g)}>
                    {g}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner mb-3" />
              <p className="text-secondary">Loading your tracks...</p>
            </div>
          ) : filteredSongs.length === 0 ? (
            <motion.div 
              className="text-center py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Music2 size={64} className="text-secondary mb-3 opacity-25" />
              <p className="text-secondary mb-4">No songs found. Start generating!</p>
              <Button variant="primary" onClick={() => window.location.href = '/generate'}>
                <Music2 size={18} className="me-2" />
                Generate Track
              </Button>
            </motion.div>
          ) : (
            <Row className="g-4">
              {filteredSongs.map((song) => (
                <Col key={song._id} md={4} lg={3}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="song-card h-100">
                      <div 
                        className="song-card-cover"
                        style={{
                          background: `linear-gradient(135deg, ${MOOD_COLORS[song.mood] || '#ffd200'}40, ${MOOD_COLORS[song.mood] || '#ffd200'}20)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Music2 size={48} className="text-white opacity-50" />
                      </div>
                      <Card.Body className="song-card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="song-card-title mb-0">{song.title || 'Untitled Track'}</h6>
                          <Dropdown>
                            <Dropdown.Toggle variant="link" className="text-secondary p-0">
                              <MoreVertical size={16} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                              <Dropdown.Item 
                                className="d-flex align-items-center gap-2"
                                onClick={() => setPlayingId(playingId === song._id ? null : song._id)}
                              >
                                {playingId === song._id ? <Pause size={14} /> : <Play size={14} />}
                                {playingId === song._id ? 'Pause' : 'Play'}
                              </Dropdown.Item>
                              <Dropdown.Item 
                                className="d-flex align-items-center gap-2"
                                onClick={() => handleDownload(song)}
                              >
                                <Download size={14} /> Download
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item 
                                className="d-flex align-items-center gap-2 text-danger"
                                onClick={() => handleDelete(song._id)}
                              >
                                <Trash2 size={14} /> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                        
                        <div className="mb-2">
                          {song.genre && <Badge className="badge-genre me-2">{song.genre}</Badge>}
                          {song.mood && <Badge className="badge-genre">{song.mood}</Badge>}
                        </div>

                        <div className="song-card-meta">
                          <span className="d-flex align-items-center gap-1">
                            <Clock size={12} /> {song.duration || 60}s
                          </span>
                          {song.bpm && (
                            <span className="d-flex align-items-center gap-1">
                              <Activity size={12} /> {song.bpm} BPM
                            </span>
                          )}
                        </div>

                        <div className="d-flex gap-2 mt-3">
                          <Button
                            variant={playingId === song._id ? 'primary' : 'outline-light'}
                            size="sm"
                            className="flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                            onClick={() => setPlayingId(playingId === song._id ? null : song._id)}
                            disabled={!song.audioUrl}
                          >
                            {playingId === song._id ? <Pause size={14} /> : <Play size={14} />}
                            {playingId === song._id ? 'Pause' : 'Play'}
                          </Button>
                          <Button 
                            variant="outline-light" 
                            size="sm"
                            onClick={() => handleDownload(song)}
                            disabled={!song.audioUrl}
                          >
                            <Download size={14} />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default Library;