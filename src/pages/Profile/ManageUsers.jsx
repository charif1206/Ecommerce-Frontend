// ManageUsers.jsx

import axiosInstance from "@/Axios/AxiosInstance";
import UserTable from "@/components/manageUsers/UserTable";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";

export default function ManageUsers() {
    const queryClient = useQueryClient();

    // Fetch all users
    const {
        data: users,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await axiosInstance.get("/users");
            return response.data;
        },
    });

    // Mutation for deleting a user.
    const deleteUserMutation = useMutation({
        mutationFn: async (userId) => {
            const response = await axiosInstance.delete(`/users/${userId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
        onError: (error) => {
            console.error("Error deleting user:", error);
        },
    });

    if (isLoading) return <div className="p-4 text-center">Loading users...</div>;
    if (error) return <div className="p-4 text-center">Error loading users.</div>;

    const userList = users || [];

    return (
        <div className="min-h-screen ">
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
