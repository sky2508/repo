import { ApiProperty } from '@nestjs/swagger';
import { Table, Column, Model } from 'sequelize-typescript';
import { BaseModel } from './base.model';
@Table
export class MasterRole extends BaseModel {
    @Column({ primaryKey: true })
    @ApiProperty({ example: 'ROLE_USER', description: 'User role' })
    name: string;

    @Column
    type: string;

    @Column
    active_status: boolean;

    @Column
    client_id: number;

    @Column
    is_saas: boolean;
}
