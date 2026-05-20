import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const aiService = {
  generateMusic: async (options) => {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/generate/music`, options);
      return response.data;
    } catch (error) {
      console.error('AI Service Music Generation Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to generate music');
    }
  },

  generateLyrics: async (options) => {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/generate/lyrics`, options);
      return response.data;
    } catch (error) {
      console.error('AI Service Lyric Generation Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to generate lyrics');
    }
  },

  cloneVoice: async (options) => {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/clone/voice`, options);
      return response.data;
    } catch (error) {
      console.error('AI Service Voice Cloning Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to clone voice');
    }
  },

  masterAudio: async (options) => {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/master/audio`, options);
      return response.data;
    } catch (error) {
      console.error('AI Service Audio Mastering Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to master audio');
    }
  },

  generateCover: async (options) => {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/generate/cover`, options);
      return response.data;
    } catch (error) {
      console.error('AI Service Cover Generation Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to generate cover image');
    }
  }
};

export default aiService;
