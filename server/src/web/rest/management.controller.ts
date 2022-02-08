import { Controller, Get, Logger, UseInterceptors } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('management')
@ApiUseTags('management-controller')
export class ManagementController {
    logger = new Logger('ManagementController');

    @ApiExcludeEndpoint()
    @Get('/info')
    @ApiOperation({ title: 'Microservice Info' })
    @ApiResponse({
        status: 200,
        description: 'Check if the microservice is up',
    })
    info(): any {
        return {
            activeProfiles: 'dev',
            'display-ribbon-on-profiles': 'dev',
        };
    }
}
