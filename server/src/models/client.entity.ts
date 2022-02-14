import { Table, Column, Model } from 'sequelize-typescript';
import { BaseModel } from './base.model';

@Table
export class Client extends Model {
    @Column({ primaryKey: true })
    id: number;
    @Column
    name: string;

    @Column
    first_name: string;

    @Column
    last_name: string;

    @Column
    company: string;

    @Column
    phone_number: string;

    @Column
    email: string;

    @Column
    address: string;

    @Column
    employee_range: string;

    @Column
    industry: string;

    @Column
    country_code: string;
}
