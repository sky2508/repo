import { AtStrategy } from './../strategies/at-strategy';
import { RtStrategy } from './../strategies/rt-strategy';
import { Module } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserModule } from '../module/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../security/passport.jwt.strategy';
import { UserJWTController } from '../web/rest/user.jwt.controller';
import { config } from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityRepository } from '../repository/authority.repository';

import { PublicUserController } from '../web/rest/public.user.controller';
import { AccountController } from '../web/rest/account.controller';
import { LoggerModule } from 'nestjs-pino';
import { pino } from 'pino';
@Module({
    imports: [
        TypeOrmModule.forFeature([AuthorityRepository]),
        UserModule,
        JwtModule.register({
            // Commenting this as we need two tokens so we will sign those token in services not here with single register function
            // secret: config['application.security.authentication.jwt.base64-secret'],
            // signOptions: { expiresIn: '300s' },
        }),
    ],
    controllers: [UserJWTController, PublicUserController, AccountController],
    // providers: [AuthService, JwtStrategy],
    providers: [AuthService, RtStrategy, AtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
