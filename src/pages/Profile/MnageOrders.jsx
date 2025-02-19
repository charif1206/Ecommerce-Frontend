import axiosInstance from "@/Axios/AxiosInstance";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import useAuthStore from "@/zustand/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// OrderStatusBadge Component
// ---------------------------------------------------------------------
function OrderStatusBadge({status}) {
    const styles = {
        pending: "bg-yellow-100 text-yellow-800",
        shipped: "bg-blue-100 text-blue-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
                styles[status] || "bg-gray-100"
            }`}
        >
            {status}
        </span>
    );
}

// ---------------------------------------------------------------------
// OrderFilters Component
// ---------------------------------------------------------------------
function OrderFilters({filter, setFilter}) {
    return (
        <div className="mb-6">
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg"
            >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>
    );
}

// ---------------------------------------------------------------------
// OrderTable Component
// ---------------------------------------------------------------------
function OrderTable({orders, onViewDetails}) {
    return (
        <div className="overflow-x-auto w-full">
            <Table className="w-full">
                <TableCaption className="text-lg font-semibold">Orders List</TableCaption>
                <TableHeader>
                    <TableRow className="text-base">
                        <TableHead className="px-6 py-4">Order ID</TableHead>
                        <TableHead className="px-6 py-4">Date</TableHead>
                        <TableHead className="px-6 py-4">Total</TableHead>
                        <TableHead className="px-6 py-4">Status</TableHead>
                        <TableHead className="px-6 py-4">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order._id} className="text-base">
                            <TableCell className="px-6 py-4">{order._id}</TableCell>
                            <TableCell className="px-6 py-4">
                                {order.createdAt
                                    ? new Date(order.createdAt).toLocaleDateString()
                                    : ""}
                            </TableCell>
                            <TableCell className="px-6 py-4">${order.totalPrice}</TableCell>
                            <TableCell className="px-6 py-4">
                                <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <button
                                    onClick={() => onViewDetails(order)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    View Details
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// ---------------------------------------------------------------------
// OrderDetailsModal Component (with Coupon Details)
// ---------------------------------------------------------------------
function OrderDetailsModal({order, onClose, onUpdateStatus, user}) {
    const [localStatus, setLocalStatus] = useState(order.status);

    useEffect(() => {
        setLocalStatus(order.status);
    }, [order.status]);

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Order Details - {order._id}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Order Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Customer</p>
                            <p className="font-medium">{order.userId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="font-medium">
                                {order.createdAt
                                    ? new Date(order.createdAt).toLocaleDateString()
                                    : ""}
                            </p>
                        </div>
                    </div>
                    {/* Coupon Details */}
                    {order.coupon && (
                        <div className="border-t pt-3 mt-2">
                            <p className="text-sm text-gray-600">Coupon Applied:</p>
                            <p className="font-medium">
                                {order.coupon.code} - ${order.coupon.value} off (Min Purchase: $
                                {order.coupon.minimumPurchase})
                            </p>
                        </div>
                    )}
                    {/* Status (only for seller or admin, if not the owner) */}
                    {(user.roles === "seller" || user.roles === "admin") &&
                        order.userId !== user._id && (
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <select
                                    value={localStatus}
                                    onChange={(e) => {
                                        const newStatus = e.target.value;
                                        setLocalStatus(newStatus);
                                        onUpdateStatus(order._id, newStatus);
                                    }}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        )}
                    {/* Products List */}
                    <div className="mt-4">
                        <p className="text-sm text-gray-600 font-medium">Products</p>
                        <div className="space-y-2">
                            {order.products && order.products.length > 0 ? (
                                order.products.map((item, index) => {
                                    const prod = item.productId;
                                    return (
                                        <div key={index} className="flex items-center space-x-4">
                                            {prod &&
                                            prod.productImages &&
                                            prod.productImages.length > 0 ? (
                                                <img
                                                    src={prod.productImages[0].url}
                                                    alt={prod.name}
                                                    className="w-12 h-12 object-contain rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {prod ? prod.name : "Unknown Product"}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Price: ${item.price}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-600">No products available.</p>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Close
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ---------------------------------------------------------------------
// Main ManageOrders Component
// ---------------------------------------------------------------------
export default function ManageOrders() {
    const user = useAuthStore((state) => state.user);
    const queryClient = useQueryClient();

    const [filter, setFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const {
        data: ordersData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["orders", user?._id],
        queryFn: async () => {
            const endpoint =
                user.roles === "seller" || user.roles === "admin"
                    ? "/orders/seller"
                    : "/orders/customer";
            const response = await axiosInstance.get(endpoint);
            return response.data.orders;
        },
        enabled: !!user,
    });

    const updateOrderStatusMutation = useMutation({
        mutationFn: async ({orderId, status}) => {
            const response = await axiosInstance.patch(`/orders/${orderId}/status`, {status});
            return response.data.order;
        },
        onSuccess: () => queryClient.invalidateQueries(["orders", user?._id]),
    });

    if (isLoading) return <div>Loading orders...</div>;
    if (error) return <div>Error loading orders.</div>;

    const orders = ordersData || [];
    const filteredOrders = orders.filter((order) => filter === "all" || order.status === filter);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold mb-6">Manage Orders</h1>
                <OrderFilters filter={filter} setFilter={setFilter} />
                <OrderTable
                    orders={filteredOrders}
                    onViewDetails={(order) => {
                        setSelectedOrder(order);
                        setIsModalOpen(true);
                    }}
                />
                {selectedOrder && isModalOpen && (
                    <OrderDetailsModal
                        order={selectedOrder}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedOrder(null);
                        }}
                        onUpdateStatus={(orderId, status) =>
                            updateOrderStatusMutation.mutate({orderId, status})
                        }
                        user={user}
                    />
                )}
            </div>
        </div>
    );
}
