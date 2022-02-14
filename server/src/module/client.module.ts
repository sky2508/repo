import { MasterRoleSeeder } from './../database/seeders/MasterRoleSeeder';
import { Client } from './../models/client.entity';
import { ClientController } from './../web/rest/client.controller';
import { ClientService } from './../service/client.service';
import { DatabaseModule } from '../database/database.module';
import { Module } from '@nestjs/common';
import { clientProviders } from '../providers/client.providers';
import { SeederModule } from 'nestjs-sequelize-seeder';
@Module({
    imports: [
        DatabaseModule,

        // SeederModule.forFeature([MasterRoleSeeder])
    ],
    controllers: [ClientController],
    providers: [ClientService, ...clientProviders],
})
export class ClientModule {}
