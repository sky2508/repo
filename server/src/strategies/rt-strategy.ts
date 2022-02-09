import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Payload } from '../security/payload.interface';
import { Request, Response } from 'express';
import { config } from '../config';
import Redis from '../redis.config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('x-refresh-token'), // means extract the token from Bearer
            ignoreExpiration: false,
            secretOrKey: config['application.security.authentication.jwt.base64-secret'], // secret key for signing the access token
            passReqToCallback: true, // we want that token for hasing further
        });
    }

    // this func  on checks the encoded token if the user inside theh token is valid user or not
    async validate(req: Request, payload: Payload, done: VerifiedCallback, res: Response): Promise<any> {
        const refreshToken = req.get('x-refresh-token');
        const client = await Redis();
        const token = await client.get(payload.id);
        if (token !== null) {
            const ok = await bcrypt.compare(refreshToken, token);
            if (ok) return true;
            else return false;
        } else {
            return false;
        }
    }
}
