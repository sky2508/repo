import { Module, NestModule, Logger, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { AuthModule } from './module/auth.module';
import { ormConfig } from './orm.config';
import { pino } from 'pino';
import { LoggerMiddleware } from './middlewares/LoggerMiddleware.middleware';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
@Module({
    imports: [
        WinstonModule.forRoot({
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    dirname: './', //path to where save loggin result
                    filename: 'debug.log', //name of file where will be saved logging result
                    level: 'debug',
                }),
                new winston.transports.File({
                    dirname: './',
                    filename: 'info.log',
                    level: 'info',
                }),
            ],
        }),
        TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('/api/*');
    }
}
