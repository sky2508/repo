import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Exclude } from 'class-transformer';
import { Authority } from '../models/authority.entity';
@Table
export class User extends Model {
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

    @HasMany(() => Authority) // creating a new table
    // @JoinTable()
    authorities?: any[];

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
}
