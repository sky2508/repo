import { Client } from '../models/client.entity';

export const clientProviders = [
    {
        provide: 'CLIENT_REPOSITORY',
        useValue: Client,
    },
];
