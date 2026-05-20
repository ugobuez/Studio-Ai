const BASE_URL = 'http://localhost:4300/api';

async function testPipeline() {
  try {
    console.log('--- Testing Studio AI Pipeline ---');

    // 1. Register User
    console.log('\n1. Registering User...');
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    
    if (!registerRes.ok) {
      throw new Error(`Registration failed: ${await registerRes.text()}`);
    }
    
    const registerData = await registerRes.json();
    const token = registerData.token;
    console.log('Registration Success, Token received.');

    const headers = { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 2. Lyric Generation
    console.log('\n2. Generating Lyrics...');
    try {
      const lyricsRes = await fetch(`${BASE_URL}/generate/lyrics`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: 'A song about the future of AI in music',
          genre: 'Afrobeat',
          mood: 'Energetic'
        })
      });
      
      if (lyricsRes.ok) {
        console.log('Lyrics generated:', await lyricsRes.json());
      } else {
        console.log('Lyrics generation failed (Service might be down):', await lyricsRes.text());
      }
    } catch (e) {
      console.log('Lyrics generation failed error:', e.message);
    }

    // 3. Music Generation (Instrumental)
    console.log('\n3. Queueing Music Generation (Instrumental)...');
    try {
      const musicRes = await fetch(`${BASE_URL}/generate/music`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: 'Upbeat Afrobeat with heavy percussion',
          genre: 'Afrobeat',
          mood: 'Happy',
          bpm: 120,
          isInstrumental: true
        })
      });
      
      if (musicRes.ok) {
        const musicData = await musicRes.json();
        const jobId = musicData.jobId;
        console.log('Music queued, Job ID:', jobId);

        // Check Status
        console.log('Checking status...');
        const statusRes = await fetch(`${BASE_URL}/generate/status/${jobId}`, { headers });
        const statusData = await statusRes.json();
        console.log('Status:', statusData.status);
      } else {
        console.log('Music generation queuing failed:', await musicRes.text());
      }
    } catch (e) {
      console.log('Music generation queuing failed error:', e.message);
    }

    // 4. Voice Sample Upload
    console.log('\n4. Listing Voice Samples...');
    const voiceSamplesRes = await fetch(`${BASE_URL}/voice/samples`, { headers });
    const voiceSamplesData = await voiceSamplesRes.json();
    console.log('Voice Samples:', voiceSamplesData.length);

    // 5. Song Library
    console.log('\n5. Checking Song Library...');
    const songsRes = await fetch(`${BASE_URL}/songs`, { headers });
    const songsData = await songsRes.json();
    console.log('Songs in library:', songsData.length);

    console.log('\n--- Pipeline Check Complete ---');
  } catch (error) {
    console.error('Pipeline check failed:', error.message);
  }
}

testPipeline();
