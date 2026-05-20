import axios from 'axios';

const BASE_URL = 'http://localhost:4300/api';

async function testPipeline() {
  try {
    console.log('--- Testing Studio AI Pipeline ---');

    // 1. Register User
    console.log('\n1. Registering User...');
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    const token = registerRes.data.token;
    console.log('Registration Success, Token received.');

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Lyric Generation
    console.log('\n2. Generating Lyrics...');
    try {
      const lyricsRes = await axios.post(`${BASE_URL}/generate/lyrics`, {
        prompt: 'A song about the future of AI in music',
        genre: 'Afrobeat',
        mood: 'Energetic'
      }, { headers });
      console.log('Lyrics generated:', lyricsRes.data);
    } catch (e) {
      console.log('Lyrics generation failed (Service might be down):', e.message);
    }

    // 3. Music Generation (Instrumental)
    console.log('\n3. Queueing Music Generation (Instrumental)...');
    try {
      const musicRes = await axios.post(`${BASE_URL}/generate/music`, {
        prompt: 'Upbeat Afrobeat with heavy percussion',
        genre: 'Afrobeat',
        mood: 'Happy',
        bpm: 120,
        isInstrumental: true
      }, { headers });
      const jobId = musicRes.data.jobId;
      console.log('Music queued, Job ID:', jobId);

      // Check Status
      console.log('Checking status...');
      const statusRes = await axios.get(`${BASE_URL}/generate/status/${jobId}`, { headers });
      console.log('Status:', statusRes.data.status);
    } catch (e) {
      console.log('Music generation queuing failed:', e.message);
    }

    // 4. Voice Sample Upload
    console.log('\n4. Listing Voice Samples...');
    const voiceSamplesRes = await axios.get(`${BASE_URL}/voice/samples`, { headers });
    console.log('Voice Samples:', voiceSamplesRes.data.length);

    // 5. Song Library
    console.log('\n5. Checking Song Library...');
    const songsRes = await axios.get(`${BASE_URL}/songs`, { headers });
    console.log('Songs in library:', songsRes.data.length);

    console.log('\n--- Pipeline Check Complete ---');
  } catch (error) {
    console.error('Pipeline check failed:', error.response?.data || error.message);
  }
}

testPipeline();
