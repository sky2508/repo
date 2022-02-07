import { Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

async function Redis(): Promise<any> {
    const logger = new Logger('REDIS');
    const options = process.env.BACKEND_ENV === 'dev' ? { url: process.env.REDIS_URI } : undefined;
    const c = createClient(options);
    c.on('error', err => logger.log('redis error'));
    c.connect();
    return c;
}

export default Redis;
