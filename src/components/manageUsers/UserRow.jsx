import {TableCell, TableRow} from "@/components/ui/table";
import DeleteUserDialog from "./DeleteUserDialog";
import {Button} from "@/components/ui/button";

const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString();
};

export default function UserRow({user, onDelete}) {
    return (
        <TableRow key={user._id} className="text-sm hover:bg-gray-100 transition-colors">
            <TableCell className="px-4 py-2">{user.username}</TableCell>
            <TableCell className="px-4 py-2">{user.email}</TableCell>
            <TableCell className="px-4 py-2">{user.phoneNumber || "N/A"}</TableCell>
            <TableCell className="px-4 py-2">{user.roles}</TableCell>
            <TableCell className="px-4 py-2">{formatDate(user.lastLogin)}</TableCell>
            <TableCell className="px-4 py-2">
                <div className="flex space-x-2">
                    {user.roles !== "admin" ? (
                        <DeleteUserDialog userId={user._id} onDelete={onDelete}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                            >
                                Delete
                            </Button>
                        </DeleteUserDialog>
                    ) : (
                        "/"
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}
