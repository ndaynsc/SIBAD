export class NoopRedis {
  async get() { return null; }
  async set() { return 'OK'; }
  async del() { return 0; }
}

export function getRedisClient() {
  if (!process.env.REDIS_URL) {
    return new NoopRedis();
  }
  try {
    const Redis = require('ioredis');
    return new Redis(process.env.REDIS_URL);
  } catch {
    return new NoopRedis();
  }
}
