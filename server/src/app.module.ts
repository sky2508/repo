import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './module/auth.module';
import { ormConfig } from './orm.config';
import { pino } from 'pino';

@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                stream: pino.destination({ dest: './logs.json', append: true }),
            },
        }),
        TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
