import axiosInstance from "@/Axios/AxiosInstance";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Helper to format dates
const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString();
};

export default function ManageUsers() {
    const queryClient = useQueryClient();

    // Fetch all users (assume your API returns an object with a "users" property)
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
    console.log(userList);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <TableCaption className="text-base font-semibold">All Users</TableCaption>
                        <TableHeader>
                            <TableRow className="text-sm">
                                <TableHead className="px-4 py-2">Username</TableHead>
                                <TableHead className="px-4 py-2">Email</TableHead>
                                <TableHead className="px-4 py-2">Phone</TableHead>
                                <TableHead className="px-4 py-2">Role</TableHead>
                                <TableHead className="px-4 py-2">Last Login</TableHead>
                                <TableHead className="px-4 py-2">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userList.map((user) => (
                                <TableRow
                                    key={user._id}
                                    className="text-sm hover:bg-gray-100 transition-colors"
                                >
                                    <TableCell className="px-4 py-2">{user.username}</TableCell>
                                    <TableCell className="px-4 py-2">{user.email}</TableCell>
                                    <TableCell className="px-4 py-2">
                                        {user.phoneNumber || "N/A"}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">{user.roles}</TableCell>
                                    <TableCell className="px-4 py-2">
                                        {formatDate(user.lastLogin)}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            {user.roles !== "admin" ? (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <button className="text-red-600 hover:text-red-800">
                                                            Delete
                                                        </button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Delete User
                                                            </AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this
                                                            user? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    deleteUserMutation.mutate(
                                                                        user._id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            ) : (
                                                "/"
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
