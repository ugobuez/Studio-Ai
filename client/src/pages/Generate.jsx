import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Sparkles, Mic2, Music2, Clock, Activity,
  CheckCircle2, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../context/authStore';
import { useGeneration } from '../hooks/useApi';
import { useSocket } from '../hooks/useSocket';

const GENRES = [
  'Afrobeat', 'Afropop', 'Amapiano', 'Highlife', 
  'Afrofusion', 'Pop', 'R&B', 'Hip-Hop'
];

const MOODS = ['Energetic', 'Melodic', 'Chill', 'Sad', 'Romantic', 'Uplifting', 'Dark'];

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const DURATIONS = [30, 60, 90, 120];

const GENERATION_STAGES = [
  { id: 'queued', label: 'Queued', icon: Clock },
  { id: 'generating_music', label: 'Generating Music', icon: Music2 },
  { id: 'synthesizing_voice', label: 'Synthesizing Voice', icon: Mic2 },
  { id: 'mastering', label: 'Mastering', icon: Activity },
  { id: 'complete', label: 'Complete', icon: CheckCircle2 },
];

const Generate = () => {
  const { isAuthenticated } = useAuthStore();
  const { startGeneration, stage, progress, setProgress, result, error } = useGeneration();
  const { joinJob, onProgress, onComplete, onError } = useSocket();
  
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Afrobeat');
  const [mood, setMood] = useState('Energetic');
  const [bpm, setBpm] = useState(120);
  const [duration, setDuration] = useState(60);
  const [key, setKey] = useState('C');
  const [lyrics, setLyrics] = useState('');
  const [isInstrumental, setIsInstrumental] = useState(false);
  const [voiceTab, setVoiceTab] = useState('ai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const jobIdRef = useRef(null);

  // Socket event handlers
  useEffect(() => {
    const unsubProgress = onProgress((data) => {
      if (data.jobId === jobIdRef.current) {
        setGenerationStage(data.stage);
        setProgress(data.percent);
      }
    });

    const unsubComplete = onComplete((data) => {
      if (data.jobId === jobIdRef.current) {
        setGenerationStage('complete');
        setProgress(100);
        setAudioUrl(data.audioUrl);
        setIsGenerating(false);
        toast.success('Track generated successfully!');
      }
    });

    const unsubError = onError((data) => {
      if (data.jobId === jobIdRef.current) {
        setIsGenerating(false);
        toast.error(data.message || 'Generation failed');
      }
    });

    return () => {
      unsubProgress();
      unsubComplete();
      unsubError();
    };
  }, [onProgress, onComplete, onError, setProgress]);

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please describe your track');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGenerationStage('queued');
    setAudioUrl('');

    try {
      const jobId = await startGeneration({
        prompt,
        genre,
        mood,
        bpm,
        key,
        duration,
        lyrics: isInstrumental ? '' : lyrics,
        isInstrumental,
      });

      jobIdRef.current = jobId;
      joinJob(jobId);
    } catch (err) {
      setIsGenerating(false);
      toast.error(err.message || 'Failed to start generation');
    }
  };

  const handleDownload = (format) => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `beatforge-track.${format}`;
      link.click();
    }
  };

  return (
    <div className="generate-page py-5 mt-5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="display-heading fs-2 mb-4">Generate Music</h1>
          
          <Row className="g-4">
            {/* Left Column - Form */}
            <Col md={5}>
              <Card className="h-100">
                <Card.Header>
                  <Sparkles size={18} className="me-2 text-gold" />
                  Music Settings
                </Card.Header>
                <Card.Body>
                  <Form>
                    {/* Prompt */}
                    <Form.Group className="mb-4">
                      <Form.Label>Describe Your Track</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="e.g., Smooth Afrobeat groove with jazzy chords and mellow vibes"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </Form.Group>

                    {/* Genre */}
                    <Form.Group className="mb-4">
                      <Form.Label>Genre</Form.Label>
                      <div className="genre-grid">
                        {GENRES.map((g) => (
                          <button
                            key={g}
                            type="button"
                            className={`genre-btn ${genre === g ? 'active' : ''}`}
                            onClick={() => setGenre(g)}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </Form.Group>

                    {/* Mood */}
                    <Form.Group className="mb-4">
                      <Form.Label>Mood</Form.Label>
                      <Form.Select
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                      >
                        {MOODS.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    {/* BPM */}
                    <Form.Group className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Form.Label className="mb-0">BPM</Form.Label>
                        <Badge bg="dark" className="text-gold">{bpm}</Badge>
                      </div>
                      <div className="range-slider">
                        <input
                          type="range"
                          min="60"
                          max="200"
                          value={bpm}
                          onChange={(e) => setBpm(Number(e.target.value))}
                        />
                      </div>
                      <div className="d-flex justify-content-between small text-secondary mt-1">
                        <span>60</span>
                        <span>200</span>
                      </div>
                    </Form.Group>

                    {/* Duration */}
                    <Form.Group className="mb-4">
                      <Form.Label>Duration</Form.Label>
                      <div className="duration-btn-group">
                        {DURATIONS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            className={`duration-btn ${duration === d ? 'active' : ''}`}
                            onClick={() => setDuration(d)}
                          >
                            {d}s
                          </button>
                        ))}
                      </div>
                    </Form.Group>

                    {/* Key */}
                    <Form.Group className="mb-4">
                      <Form.Label>Key</Form.Label>
                      <div className="key-grid">
                        {KEYS.map((k) => (
                          <button
                            key={k}
                            type="button"
                            className={`key-btn ${key === k ? 'active' : ''}`}
                            onClick={() => setKey(k)}
                          >
                            {k}
                          </button>
                        ))}
                      </div>
                    </Form.Group>

                    {/* Lyrics */}
                    <Form.Group className="mb-4">
                      <Form.Label>Lyrics (optional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Enter your lyrics or leave blank for instrumental..."
                        value={lyrics}
                        onChange={(e) => setLyrics(e.target.value)}
                        disabled={isInstrumental}
                      />
                      <Form.Text className="text-secondary">
                        Or enable AI lyric generation below
                      </Form.Text>
                    </Form.Group>

                    {/* Instrumental Toggle */}
                    <Form.Group className="mb-4">
                      <Form.Check
                        type="switch"
                        id="instrumental-switch"
                        label="Instrumental Track"
                        checked={isInstrumental}
                        onChange={(e) => setIsInstrumental(e.target.checked)}
                      />
                    </Form.Group>

                    {/* Voice Section */}
                    {!isInstrumental && (
                      <div className="border-top pt-4 mt-4">
                        <Form.Label className="mb-3">Voice Settings</Form.Label>
                        <Nav variant="tabs" className="mb-3">
                          <Nav.Item>
                            <Nav.Link
                              active={voiceTab === 'ai'}
                              onClick={() => setVoiceTab('ai')}
                            >
                              <Sparkles size={14} className="me-1" />
                              AI Voice
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              active={voiceTab === 'upload'}
                              onClick={() => setVoiceTab('upload')}
                            >
                              <Mic2 size={14} className="me-1" />
                              Upload Sample
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>

                        {voiceTab === 'upload' && (
                          <div className="upload-zone">
                            <Mic2 size={32} className="text-gold mb-2" />
                            <p className="mb-2">Drag & drop your voice sample here</p>
                            <p className="text-secondary small mb-0">WAV or MP3, max 10MB</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Generate Button */}
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="primary"
                        className="w-100 py-3 mt-3"
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 size={20} className="spinner me-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles size={20} className="me-2" />
                            Generate Track
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Column - Result */}
            <Col md={7}>
              <Card className="h-100">
                <Card.Header>
                  <Activity size={18} className="me-2 text-gold" />
                  Generation Progress
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                  {isGenerating || progress > 0 ? (
                    <>
                      {/* Progress Stages */}
                      <div className="mb-4">
                        {GENERATION_STAGES.map(({ id, label, icon: Icon }, index) => {
                          const stageIndex = GENERATION_STAGES.findIndex(s => s.id === generationStage);
                          const isComplete = index < stageIndex;
                          const isCurrent = index === stageIndex;
                          
                          return (
                            <motion.div
                              key={id}
                              className={`d-flex align-items-center gap-3 p-3 rounded-3 mb-2 ${
                                isCurrent ? 'bg-gold-10' : ''
                              }`}
                              style={{
                                background: isCurrent ? 'rgba(255, 210, 0, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                border: isCurrent ? '1px solid rgba(255, 210, 0, 0.3)' : '1px solid transparent'
                              }}
                              animate={isCurrent ? { scale: [1, 1.02, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              <div className={`p-2 rounded-circle ${
                                isComplete ? 'bg-success' : isCurrent ? 'bg-warning' : 'bg-secondary'
                              }`}>
                                {isComplete ? (
                                  <CheckCircle2 size={20} className="text-white" />
                                ) : isCurrent ? (
                                  <Loader2 size={20} className="spinner text-dark" />
                                ) : (
                                  <Icon size={20} className="text-white-50" />
                                )}
                              </div>
                              <span className={isCurrent ? 'text-gold fw-semibold' : isComplete ? 'text-success' : 'text-secondary'}>
                                {label}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-secondary small">Progress</span>
                          <span className="text-gold small fw-semibold">{Math.round(progress)}%</span>
                        </div>
                        <div className="progress">
                          <motion.div
                            className="progress-bar progress-striped"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    </>
                  ) : audioUrl ? (
                    /* Completed State */
                    <div className="text-center py-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                      >
                        <CheckCircle2 size={64} className="text-success mb-4" />
                      </motion.div>
                      <h4 className="mb-3">Track Ready!</h4>
                      <div className="d-flex gap-2 justify-content-center mb-4">
                        <Button variant="primary" onClick={() => handleDownload('wav')}>
                          Download WAV
                        </Button>
                        <Button variant="outline-light" onClick={() => handleDownload('mp3')}>
                          Download MP3
                        </Button>
                      </div>
                      <Button 
                        variant="outline-light" 
                        onClick={() => window.location.href = '/library'}
                      >
                        Save to Library
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-secondary py-5">
                      <Music2 size={64} className="mb-4 opacity-25" />
                      <p>Configure your settings and click Generate to create your track</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

export default Generate;