import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from './dto/user-login.dto';
import { Payload, RefreshTokenPayload } from '../security/payload.interface';
import { AuthorityRepository } from '../repository/authority.repository';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { FindManyOptions } from 'typeorm';
import Redis from '../redis.config';
import { config } from '../config';
import { Response as Res } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    logger = new Logger('AuthService');

    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(AuthorityRepository) private authorityRepository: AuthorityRepository,
        private userService: UserService,
    ) {}

    async getTokens(payload: Payload) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: config['application.security.authentication.jwt.base64-secret'],
                expiresIn: config['application.security.authentication.jwt.token-validity-in-seconds'], // 1day
            }),

            this.jwtService.signAsync(
                { id: payload.id },
                {
                    secret: config['application.security.authentication.jwt.base64-secret'],
                    expiresIn: config['application.security.authentication.jwt.refresh-token-validity-in-days'], // 7days
                },
            ),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    async login(userLogin: UserLoginDTO): Promise<any> {
        const loginUserName = userLogin.username;
        const loginPassword = userLogin.password;
        const client = await Redis();
        const userFind = await this.userService.findByFields({ where: { login: loginUserName } });
        const validPassword = !!userFind && (await bcrypt.compare(loginPassword, userFind.password));
        if (!userFind || !validPassword) {
            throw new HttpException('Invalid login name or password!', HttpStatus.BAD_REQUEST);
        }

        if (userFind && !userFind.activated) {
            throw new HttpException('Your account is not been activated!', HttpStatus.BAD_REQUEST);
        }

        const user = await this.findUserWithAuthById(userFind.id);

        const payload: Payload = { id: user.id, username: user.login, authorities: user.authorities };

        const tokens = await this.getTokens(payload);

        const saltOrRounds = 10;

        const hashedRefresTokenForRedis = await bcrypt.hash(tokens.refresh_token, saltOrRounds);
        client.set(user.id, hashedRefresTokenForRedis);

        return {
            ...tokens,
        };
    }

    async logout(userId: number) {
        const client = await Redis();
        client.del(userId);
    }
    /* eslint-enable */
    async validateUser(payload: Payload): Promise<UserDTO | undefined> {
        return await this.findUserWithAuthById(payload.id);
    }

    async findUserWithAuthById(userId: number): Promise<UserDTO | undefined> {
        const userDTO: UserDTO = await this.userService.findByFields({ where: { id: userId } });
        return userDTO;
    }

    async getAccount(userId: number): Promise<UserDTO | undefined> {
        const userDTO: UserDTO = await this.findUserWithAuthById(userId);
        if (!userDTO) {
            return;
        }
        return userDTO;
    }

    async changePassword(userLogin: string, currentClearTextPassword: string, newPassword: string): Promise<void> {
        const userFind: UserDTO = await this.userService.findByFields({ where: { login: userLogin } });
        if (!userFind) {
            throw new HttpException('Invalid login name!', HttpStatus.BAD_REQUEST);
        }

        if (!(await bcrypt.compare(currentClearTextPassword, userFind.password))) {
            throw new HttpException('Invalid password!', HttpStatus.BAD_REQUEST);
        }
        userFind.password = newPassword;
        await this.userService.save(userFind, userLogin, true);
        return;
    }

    async registerNewUser(newUser: UserDTO): Promise<UserDTO> {
        let userFind: UserDTO = await this.userService.findByFields({ where: { login: newUser.login } });
        if (userFind) {
            throw new HttpException('Login name already used!', HttpStatus.BAD_REQUEST);
        }
        userFind = await this.userService.findByFields({ where: { email: newUser.email } });
        if (userFind) {
            throw new HttpException('Email is already in use!', HttpStatus.BAD_REQUEST);
        }
        newUser.authorities = ['ROLE_USER'];
        const user: UserDTO = await this.userService.save(newUser, newUser.login, true);
        return user;
    }

    async updateUserSettings(userLogin: string, newUserInfo: UserDTO): Promise<UserDTO> {
        const userFind: UserDTO = await this.userService.findByFields({ where: { login: userLogin } });
        if (!userFind) {
            throw new HttpException('Invalid login name!', HttpStatus.BAD_REQUEST);
        }
        const userFindEmail: UserDTO = await this.userService.findByFields({ where: { email: newUserInfo.email } });
        if (userFindEmail && newUserInfo.email !== userFind.email) {
            throw new HttpException('Email is already in use!', HttpStatus.BAD_REQUEST);
        }

        userFind.firstName = newUserInfo.firstName;
        userFind.lastName = newUserInfo.lastName;
        userFind.email = newUserInfo.email;
        userFind.langKey = newUserInfo.langKey;
        await this.userService.save(userFind, userLogin);
        return;
    }

    async getAllUsers(options: FindManyOptions<UserDTO>): Promise<[UserDTO[], number]> {
        return await this.userService.findAndCount(options);
    }
}
