import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Download } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';

const AudioPlayer = ({ audioUrl, title, genre, onDownload }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    if (waveformRef.current && audioUrl) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'rgba(255, 210, 0, 0.3)',
        progressColor: 'rgba(255, 210, 0, 0.8)',
        cursorColor: '#FFD200',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 2,
        height: 80,
        barGap: 2,
      });

      wavesurfer.current.load(audioUrl);

      wavesurfer.current.on('ready', () => {
        setDuration(wavesurfer.current.getDuration());
      });

      wavesurfer.current.on('audioprocess', () => {
        setCurrentTime(wavesurfer.current.getCurrentTime());
      });

      wavesurfer.current.on('finish', () => {
        setIsPlaying(false);
      });

      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
      };
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(newVolume);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="audio-player-card">
      <Card.Body>
        <Row className="align-items-center g-3">
          {/* Info */}
          <Col md={3}>
            <div className="d-flex align-items-center gap-2">
              <div 
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{ width: '50px', height: '50px', background: 'rgba(255, 210, 0, 0.1)' }}
              >
                <Volume2 size={24} className="text-gold" />
              </div>
              <div>
                <p className="mb-0 fw-semibold">{title || 'Untitled Track'}</p>
                {genre && <Badge className="badge-genre">{genre}</Badge>}
              </div>
            </div>
          </Col>

          {/* Controls */}
          <Col md={6}>
            <div className="d-flex align-items-center justify-content-center gap-3">
              <Button variant="link" className="text-secondary p-1">
                <SkipBack size={20} />
              </Button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--gradient-btn)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {isPlaying ? (
                  <Pause size={20} className="text-dark" />
                ) : (
                  <Play size={20} className="text-dark ms-1" />
                )}
              </motion.button>

              <Button variant="link" className="text-secondary p-1">
                <SkipForward size={20} />
              </Button>
            </div>

            {/* Waveform */}
            <div ref={waveformRef} className="mt-3" />
            
            {/* Time */}
            <div className="d-flex justify-content-between small text-secondary mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </Col>

          {/* Volume & Download */}
          <Col md={3}>
            <div className="d-flex align-items-center justify-content-end gap-3">
              <div className="d-flex align-items-center gap-2">
                <Volume2 size={18} className="text-secondary" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-50"
                />
              </div>
              
              <Button 
                variant="outline-light" 
                size="sm"
                className="d-flex align-items-center gap-2"
                onClick={onDownload}
              >
                <Download size={16} />
                Download
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AudioPlayer;
