import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Client extends Model {
    @Column
    name: string;

    @Column
    age: number;
}
