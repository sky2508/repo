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
import { ok } from 'assert';

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

    // this function checks the encoded token if the user inside theh token is valid user or not
    async validate(req: Request, payload: Payload, done: VerifiedCallback): Promise<any> {
        const at = req.get('authorization').split(' ')[1];
        console.log('TOKEN IS COMMING', at);

        try {
            const isOk = await this.JwtService.verify(at, {
                secret: config['application.security.authentication.jwt.base64-secret'],
            });
            const user = await this.authService.validateUser(payload);

            if (!user) {
                return done(new UnauthorizedException({ message: 'user does not exist' }), false);
            }

            return done(null, user);
        } catch (err) {
            const newToken = this.JwtService.sign(payload, {
                secret: config['application.security.authentication.jwt.base64-secret'],
                expiresIn: config['application.security.authentication.jwt.refresh-token-validity-in-days'],
            });
            console.log('CACTCH BLOCK');
            req.res.setHeader('x-update-access-token-flag', 1);
            req.res.setHeader('Authorization', newToken);
            return done(null, newToken);
        }
    }
}
