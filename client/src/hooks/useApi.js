import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuthStore } from '../context/authStore';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4300/api';

export const useSongs = () => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  const fetchSongs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/songs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSongs(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch songs');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const deleteSong = async (id) => {
    try {
      await axios.delete(`${API_URL}/songs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSongs(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete song');
    }
  };

  useEffect(() => {
    if (token) fetchSongs();
  }, [token, fetchSongs]);

  return { songs, isLoading, error, fetchSongs, deleteSong };
};

export const useGeneration = () => {
  const [jobId, setJobId] = useState(null);
  const [stage, setStage] = useState('');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  const startGeneration = async (params) => {
    setError(null);
    setProgress(0);
    setStage('queued');

    try {
      const res = await axios.post(`${API_URL}/generate/music`, params, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobId(res.data.jobId);
      return res.data.jobId;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start generation');
      throw err;
    }
  };

  const checkStatus = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/generate/status/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStage(res.data.stage);
      setProgress(res.data.progress || 0);
      if (res.data.status === 'done') {
        setResult(res.data);
      }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check status');
    }
  };

  return { jobId, stage, progress, result, error, startGeneration, checkStatus, setProgress, setStage };
};

export const useVoiceSamples = () => {
  const [samples, setSamples] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  const fetchSamples = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/voice/samples`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSamples(res.data);
    } catch (err) {
      console.error('Failed to fetch voice samples:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadSample = async (file) => {
    const formData = new FormData();
    formData.append('voiceSample', file);

    try {
      const res = await axios.post(`${API_URL}/voice/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSamples(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteSample = async (id) => {
    try {
      await axios.delete(`${API_URL}/voice/samples/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSamples(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return { samples, isLoading, fetchSamples, uploadSample, deleteSample };
};
