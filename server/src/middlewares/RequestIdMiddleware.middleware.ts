import {
    Injectable,
    NestMiddleware,
    Logger,
    Inject,
    LoggerService,
    HttpException,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(request: Request, response: Response, next: NextFunction): void {
        const userAgent = request.get('X-Request-id');
        if (userAgent == undefined) {
            throw new HttpException(
                'We are unable to proccess the request.Please send request-id',
                HttpStatus.NON_AUTHORITATIVE_INFORMATION,
            );
        }
        next();
    }
}
0;
