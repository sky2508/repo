import { Injectable, NestMiddleware, Logger, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}
    // private logger = new Logger('HTTP LOG');
    use(request: Request, response: Response, next: NextFunction): void {
        const { ip, method, path: url, body, params, baseUrl } = request;
        // console.log(request);
        const userAgent = request.get('user-agent') || '';
        response.on('close', () => {
            const { statusCode } = response;
            const contentLength = response.get('content-length');
            const responseTime = response.get('x-response-time');
            this.logger.log(`${method} ${baseUrl} ${statusCode} ${responseTime} ${userAgent} ${ip}`);
        });
        next();
    }
}
