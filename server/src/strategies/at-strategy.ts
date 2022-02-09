import { HeaderUtil } from './../client/header-util';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { Injectable, UnauthorizedException, Logger, Headers } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Payload } from '../security/payload.interface';
import { config } from '../config';
import { Request, Response } from 'express';
import supertest from 'supertest';
import { threadId } from 'worker_threads';
import { resolve } from 'dns';
import { doesNotThrow, ok } from 'assert';
import { ClientClosedError } from 'redis';
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly authService: AuthService, private readonly JwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // means extract the token from Bearer
            ignoreExpiration: true,
            secretOrKey: config['application.security.authentication.jwt.base64-secret'], // secret key for signing the access token
            passReqToCallback: true, // we want that token for hasing further, you won't be able to access request in validate function if not activated
        });
    }
    async validate(req: Request, payload: Payload, done: VerifiedCallback): Promise<any> {
        const at = req.get('authorization').split(' ')[1];
        try {
            const isOk = await this.JwtService.verify(at, {
                secret: config['application.security.authentication.jwt.base64-secret'],
            });

            if (isOk) {
                const user = await this.authService.validateUser(payload);

                if (!user) {
                    return done(new UnauthorizedException({ message: 'user does not exist' }), false);
                }

                return done(null, user);
            } else {
                new Error('Genertate new one');
            }
        } catch (err) {
            const newToken = this.JwtService.sign(
                {
                    id: payload.id,
                    username: payload.username,
                    authorities: payload.authorities,
                },
                {
                    secret: config['application.security.authentication.jwt.base64-secret'],
                    expiresIn: config['application.security.authentication.jwt.token-validity-in-seconds'],
                },
            );

            HeaderUtil.createAccessTokenAlert(req.res, newToken);
        }
    }
}
