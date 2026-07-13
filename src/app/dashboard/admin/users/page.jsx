import UsersTable from '@/components/dashboard/admin/UsersTable';
import { getUsersList } from '@/lib/api/users';


const AdminUsersPage = async () => {
    const data = await getUsersList();
    const users = data?.users ?? [];

    return <UsersTable users={users} totalCount={data?.total ?? users.length} />;
};

export default AdminUsersPage;