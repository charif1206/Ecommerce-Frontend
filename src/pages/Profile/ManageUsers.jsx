// ManageUsers.jsx
import UserTable from "@/components/manageUsers/UserTable";
import { useUsers } from "./hooks/useUsers";
import { useDeleteUser } from "./hooks/useDeleteUser";

export default function ManageUsers() {
    const {data: users, isLoading, error} = useUsers();
    const deleteUserMutation = useDeleteUser();

    if (isLoading) return <div className="p-4 text-center">Loading users...</div>;
    if (error) return <div className="p-4 text-center">Error loading users.</div>;

    const userList = users || [];

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
                <UserTable
                    users={userList}
                    onDelete={(userId) => deleteUserMutation.mutate(userId)}
                />
            </div>
        </div>
    );
}
