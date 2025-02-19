import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Eye} from "lucide-react"; // Using the Eye icon for viewing details
import OrderStatusBadge from "./OrderStatusBadge"; // Adjust path if necessary

export default function OrderTable({orders, onViewDetails}) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
                <TableCaption className="text-lg font-semibold mb-4 caption-top">
                    Orders List
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="font-semibold text-gray-700 px-6 py-3">
                            Order ID
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 px-6 py-3">
                            Date
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 px-6 py-3">
                            Total
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 px-6 py-3">
                            Status
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 px-6 py-3">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order._id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="px-6 py-4 font-medium">{order._id}</TableCell>
                            <TableCell className="px-6 py-4">
                                {order.createdAt
                                    ? new Date(order.createdAt).toLocaleDateString()
                                    : ""}
                            </TableCell>
                            <TableCell className="px-6 py-4 font-semibold">
                                ${order.totalPrice.toFixed(2)}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onViewDetails(order)}
                                >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
