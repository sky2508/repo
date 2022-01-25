import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { ormConfig } from './orm.config';

@Module({
    imports: [TypeOrmModule.forRootAsync({ useFactory: ormConfig }), AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
