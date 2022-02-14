import { Injectable, Inject } from '@nestjs/common';
import { Client } from 'src/models/client.entity';
@Injectable()
export class ClientService {
    constructor(
        @Inject('CLIENT_REPOSITORY')
        private clientRepository: typeof Client,
    ) {}

    async findAll(): Promise<Client[]> {
        return this.clientRepository.findAll<Client>();
    }
}
