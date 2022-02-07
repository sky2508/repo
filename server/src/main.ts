require('dotenv').config({ path: '.env' });
import { NestFactory } from '@nestjs/core';
import cloudConfigClient from 'cloud-config-client';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { config } from './config';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { Logger as LG } from 'nestjs-pino';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { isEmail } from 'class-validator';
import { PropertyMetadata } from '@nestjs/core/injector/instance-wrapper';
import client from './redis.config';

const logger: Logger = new Logger('Main');
const port = process.env.NODE_SERVER_PORT || config.get('server.port');
const useApplicationRegistry = config.get('eureka.client.enabled');

async function bootstrap(): Promise<void> {
    loadCloudConfig();
    registerAsEurekaService();

    const appOptions = { cors: true };
    const app = await NestFactory.create(AppModule, {
        logger: false,
    });
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    // app.useLogger(app.get(LG));

    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (): BadRequestException => new BadRequestException('Validation error'),
        }),
    );

    // logger.log('The client is not been generated');
    setupSwagger(app);

    await app.listen(port);

    // logger.log(`Application listening on port ${port}`);
}

async function loadCloudConfig(): Promise<void> {
    if (useApplicationRegistry) {
        const endpoint = config.get('cloud.config.uri') || 'http://admin:admin@localhost:8761/config';
        // logger.log(`Loading cloud config from ${endpoint}`);

        const cloudConfig = await cloudConfigClient.load({
            context: process.env,
            endpoint,
            name: config.get('cloud.config.name'),
            profiles: config.get('cloud.config.profile') || ['prod'],
            // auth: {
            //   user: config.get('application.registry.username') || 'admin',
            //   pass: config.get('application.registry.password') || 'admin'
            // }
        });
        config.addAll(cloudConfig.properties);
    }
}

function registerAsEurekaService(): void {
    if (useApplicationRegistry) {
        // logger.log(`Registering with eureka ${config.get('cloud.config.uri')}`);
        const Eureka = require('eureka-js-client').Eureka;
        const eurekaUrl = require('url').parse(config.get('cloud.config.uri'));
        const client = new Eureka({
            instance: {
                app: config.get('eureka.instance.appname'),
                instanceId: config.get('eureka.instance.instanceId'),
                hostName: config.get('ipAddress') || 'localhost',
                ipAddr: config.get('ipAddress') || '127.0.0.1',
                status: 'UP',
                port: {
                    $: port,
                    '@enabled': 'true',
                },
                vipAddress: config.get('ipAddress') || 'localhost',
                homePageUrl: `http://${config.get('ipAddress')}:${port}/`,
                dataCenterInfo: {
                    '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                    name: 'MyOwn',
                },
            },
            eureka: {
                // eureka server host / port
                host: eurekaUrl.hostname || '127.0.0.1',
                port: eurekaUrl.port || 8761,
                servicePath: '/eureka/apps',
            },
            requestMiddleware: (requestOpts, done): any => {
                requestOpts.auth = {
                    user: config.get('application.registry.username') || 'admin',
                    password: config.get('application.registry.password') || 'admin',
                };
                done(requestOpts);
            },
        });
        client.logger.level('debug');
        client.start(error => {});
    }
}

bootstrap();
