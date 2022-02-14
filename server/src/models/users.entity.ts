import { Table, Column, Model, HasMany, ForeignKey } from 'sequelize-typescript';
import { Exclude } from 'class-transformer';
import { MasterRole } from './masterRole.model';
import { BaseModel } from './base.model';
@Table
export class User extends BaseModel {
    @Column
    login: string;
    @Column
    firstName?: string;
    @Column
    lastName?: string;
    @Column
    email: string;
    @Column
    activated?: boolean;
    @Column
    langKey?: string;

    @ForeignKey(() => MasterRole)
    @Column // creating a new table
    // @JoinTable()
    role_id: number;
    // authorities?: any[];

    @Column
    @Exclude()
    password: string;
    @Column
    imageUrl?: string;
    @Column
    activationKey?: string;
    @Column
    resetKey?: string;
    @Column
    resetDate?: Date;
    @Column
    user_name: string;

    @Column
    client_id: number;

    @Column
    user_type: string;

    @Column
    country_code: string;
}
