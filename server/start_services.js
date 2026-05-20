import RedisServer from 'redis-server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'child_process';
import fs from 'fs';

async function startServices() {
  console.log('Starting MongoDB Memory Server...');
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'studioai'
    }
  });
  console.log('MongoDB Memory Server started at', mongod.getUri());

  console.log('Starting Redis Server...');
  const redisServer = new RedisServer(6379);
  await redisServer.open();
  console.log('Redis Server started on port 6379');

  console.log('Starting Express Server...');
  const server = spawn('node', ['app.js'], {
    env: { ...process.env, MONGODB_URI: mongod.getUri(), REDIS_URL: 'redis://localhost:6379', PORT: '4300' },
    stdio: 'inherit'
  });

  server.on('close', (code) => {
    console.log(`Express server exited with code ${code}`);
    process.exit(code);
  });
}

startServices().catch(err => {
  console.error('Failed to start services:', err);
  process.exit(1);
});
