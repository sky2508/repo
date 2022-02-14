import { ApiProperty } from '@nestjs/swagger';
import { Table, Column, Model } from 'sequelize-typescript';
@Table
export class Authority extends Model {
    @Column({ primaryKey: true })
    @ApiProperty({ example: 'ROLE_USER', description: 'User role' })
    name: string;
}
