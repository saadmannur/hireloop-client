import { getUsersList } from '@/lib/api/users';
import React from 'react';
import UsersTable2 from './UsersTable2';

const AdminUserPage2 = async () => {

    const data = await getUsersList();
        const users = data?.users ?? [];

    return (
        <div>
            <UsersTable2 users={users}></UsersTable2>
        </div>
    );
};

export default AdminUserPage2;