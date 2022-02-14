import { Body, Controller, Logger, Post, Res, Req, UseInterceptors } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserLoginDTO } from '../../service/dto/user-login.dto';
import { AuthService } from '../../service/auth.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('api')
@ApiTags('user-jwt-controller')
export class UserJWTController {
    logger = new Logger('UserJWTController');

    constructor(private readonly authService: AuthService) {}

    @Post('/authenticate')
    @ApiOperation({ summary: 'Authorization api retrieving token' })
    @ApiResponse({
        status: 201,
        description: 'Authorized',
    })
    async authorize(@Req() req: Request, @Body() user: UserLoginDTO, @Res() res: Response): Promise<any> {
        const responseForLogin = await this.authService.login(user);
        res.setHeader('Authorization', 'Bearer ' + responseForLogin.access_token);
        res.setHeader('x-refresh-token', responseForLogin.refresh_token);
        return res.json(responseForLogin);
    }
}
