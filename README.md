# skygge_validate

This application was generated using the [NodeJS blueprint](https://github.com/jhipster/generator-jhipster-nodejs) of JHipster 7.0.1, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v7.0.1](https://www.jhipster.tech/documentation-archive/v7.0.1). For any questions you can refer to the stream lead: [Angelo Manganiello](https://github.com/amanganiello90).

## Development

To start your application in the dev profile, simply run:

    cd server && npm install
    npm run start:app

Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](package.json).

    npm install
    cd server && npm install

The `npm run` command will list all of the scripts available to run for this project.

## Using Docker to simplify development (optional)

You can use Docker to improve your JHipster development experience. A number of docker-compose configuration are available in the [src/main/docker](src/main/docker) folder to launch required third party services.
You can also fully dockerize your application and all the services that it depends on.

For example, to start a mysql database in a docker container, run:

    docker-compose -f src/main/docker/mysql.yml up -d

To stop it and remove the container, run:

    docker-compose -f src/main/docker/mysql.yml down

For the entire app run:

```
docker-compose -f src/main/docker/app.yml up -d
```

For more information refer to [Using Docker and Docker-Compose][], this page also contains information on the docker-compose sub-generator (`jhipster docker-compose`), which is able to generate docker configurations for one or several JHipster applications.

## JWT authentication and authorization

Congratulations! You've selected an excellent way to secure your NHipster application. If you're not sure what JSON Web Token (JWT) is, please see [What the Heck is JWT?](https://jwt.io/introduction/)

Your app uses, to get and use the token, the `server/src/config/application.yml` settings:

```yaml
  ...
  security:
    authentication:
        jwt:
            # This token must be encoded using Base64 and be at least 256 bits long (you can type `openssl rand -base64 64` on your command line to generate a 512 bits one)
            base64-secret: {yourSecret}
            # Token is valid 24 hours
            token-validity-in-seconds: 86400
            token-validity-in-seconds-for-remember-me: 2592000
```

You can use the default secret created from the app, or change it.
So to get a token, you have to pass a POST request on the _api/authenticate_ url with **UserLoginDTO** as body.
For this you can use **swagger ui** on **/api/v2/api-docs** path, or the client login page (if you have generated it).

### Using NestJS CLI

You can also use [NestJS CLI][] to generate some custom server code.

For example, the following command:

    nest generate module my-module

will generate the file:

    create server/src/my-component/my-component.module.ts

## Building and running

#### Running

```bash
npm run start:app
```

#### Building

```bash
npm run build:app
```

The build folder with all compiled sources will be **server/dist**.

> For more explanation about full stack server/client build refer to [server/README.md](server/README.md)

### Code quality

Sonar is used to analyse code quality. You can start a local Sonar server (accessible on http://localhost:9001) with:

```
docker-compose -f src/main/docker/sonar.yml up -d
```

You can run a Sonar analysis with using the [sonar-scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner).
Then, run a Sonar analysis in the server folder:

    npm run sonar:scanner

For more information, refer to the [Code quality page][].

[jhipster homepage and latest documentation]: https://www.jhipster.tech
[jhipster 7.0.1 archive]: https://www.jhipster.tech/documentation-archive/v7.0.1
[using jhipster in development]: https://www.jhipster.tech/documentation-archive/v7.0.1/development/
[using docker and docker-compose]: https://www.jhipster.tech/documentation-archive/v7.0.1/docker-compose
[using jhipster in production]: https://www.jhipster.tech/documentation-archive/v7.0.1/production/
[running tests page]: https://www.jhipster.tech/documentation-archive/v7.0.1/running-tests/
[code quality page]: https://www.jhipster.tech/documentation-archive/v7.0.1/code-quality/
[setting up continuous integration]: https://www.jhipster.tech/documentation-archive/v7.0.1/setting-up-ci/
[node.js]: https://nodejs.org/
[yarn]: https://yarnpkg.org/
[webpack]: https://webpack.github.io/
[jest]: https://facebook.github.io/jest/
[nestjs]: https://nestjs.com/
[nestjs cli]: https://docs.nestjs.com/cli/usages
