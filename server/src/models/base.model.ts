import { Table, Column, Model } from 'sequelize-typescript';

@Table({
    timestamps: false,
})
export abstract class BaseModel extends Model {
    @Column({ primaryKey: true })
    id?: number;
    @Column
    createdBy?: string;
    @Column
    createdDate?: Date;
    @Column
    lastModifiedBy?: string;
    @Column
    lastModifiedDate?: Date;
}
