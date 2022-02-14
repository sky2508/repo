import { MasterRole } from './../models/masterRole.model';
import { Sequelize } from 'sequelize-typescript';
import { Client } from '../models/client.entity';
import { User } from '../models/users.entity';
export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                dialect: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: '',
                database: 'nestdb5',
            });
            sequelize.addModels([Client, User, MasterRole]);
            await sequelize.sync();
            return sequelize;
        },
    },
];
