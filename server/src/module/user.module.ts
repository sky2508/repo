import { UserService } from './../service/user.service';
import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { UserController } from '../web/rest/user.controller';
import { ManagementController } from '../web/rest/management.controller';
import { UserRepository } from '../repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
    imports: [TypeOrmModule.forFeature([UserRepository])],
    controllers: [UserController, ManagementController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
