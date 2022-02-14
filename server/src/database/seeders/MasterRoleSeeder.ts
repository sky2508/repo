import { MasterRole } from '../../models/masterRole.model';
import { Seeder, OnSeederInit } from 'nestjs-sequelize-seeder';

@Seeder({
    model: MasterRole,
    runOnlyIfTableIsEmpty: true,
    // unique: ['name', 'username'],
})
export class MasterRoleSeeder implements OnSeederInit {
    run() {
        const data = [
            {
                id: 1,
                createdBy: '1',
                createdDate: '2022-02-14 12:57:45',
                lastModifiedBy: '1',
                lastModifiedDate: '2022-02-14 12:58:34',
                name: 'SuperAdmin',
                type: 'System',
                active_status: 1,
                client_id: 1,
                is_saas: 0,
            },
            {
                id: 2,
                createdBy: '1',
                createdDate: '2022-02-14 12:59:38',
                lastModifiedBy: '1',
                lastModifiedDate: '2022-02-14 13:00:50',
                name: 'Admin',
                type: 'System',
                active_status: 1,
                client_id: 1,
                is_saas: 0,
            },
            {
                id: 3,
                createdBy: '1',
                createdDate: '2022-02-14 13:00:34',
                lastModifiedBy: '1',
                lastModifiedDate: '2022-02-14 13:00:34',
                name: 'User',
                type: 'System',
                active_status: 1,
                client_id: 1,
                is_saas: 0,
            },
        ];
        return data;
    }

    // This function is optional!
    // everyone(data) {
    //     // Encrypting the password for each user !
    //     if (data.password) {
    //         const salt = genSaltSync(10);
    //         data.password = hashSync(data.password, salt);
    //         data.salt = salt;
    //     }

    //     // Aggregated timestamps
    //     data.created_at = new Date().toISOString();
    //     data.updated_at = new Date().toISOString();

    //     return data;
    // }
}
