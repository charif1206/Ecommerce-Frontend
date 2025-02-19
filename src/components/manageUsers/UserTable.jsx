import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import UserRow from "./UserRow";

export default function UserTable({users, onDelete}) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table className="w-full">
                <TableCaption className="text-lg font-semibold mb-4 caption-top">
                    All Users
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="px-4 py-3 font-semibold text-gray-700">
                            Username
                        </TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-gray-700">
                            Email
                        </TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-gray-700">
                            Phone
                        </TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-gray-700">
                            Role
                        </TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-gray-700">
                            Last Login
                        </TableHead>
                        <TableHead className="px-4 py-3 font-semibold text-gray-700">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <UserRow key={user._id} user={user} onDelete={onDelete} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
