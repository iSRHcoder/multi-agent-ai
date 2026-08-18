import Redis from 'ioredis';

const redis = new Redis(
  process.env.REDIS_URL || {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
  }
);

redis.on('connect', () => {
  console.log('Redis connected');
});

export default redis;
