import { createClient, RedisClientType } from 'redis';

async function client(): Promise<any> {
    const options = process.env.BACKEND_ENV === 'prod' ? { url: process.env.REDIS_URI } : null;
    const c = createClient();
    c.on('error', err => console.log('redis error'));
    c.connect();
    return c;
}

export default client;
