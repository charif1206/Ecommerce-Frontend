// OrderDetailsModal.jsx
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"; // Import shadcn/ui Select components
import {useEffect, useState} from "react";

export default function OrderDetailsModal({order, onClose, onUpdateStatus, user}) {
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
                            <p className="font-medium">
                                {order.userId?.username ?? order.userId?.email ?? "Unknown user"}
                            </p>
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

                    {/* Status (only for seller or admin, if not the buyer) */}
                    {(user.roles === "seller" || user.roles === "admin") &&
                        order.userId?._id?.toString() !== user._id && (
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <Select
                                    value={localStatus}
                                    onValueChange={(newStatus) => {
                                        setLocalStatus(newStatus);
                                        onUpdateStatus(order._id, newStatus);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                            {prod?.productImages?.length > 0 ? (
                                                <img
                                                    src={
                                                        prod.productImages[0]?.url ||
                                                        prod.productImages[0]
                                                    }
                                                    alt={prod.name}
                                                    className="w-12 h-12 object-contain rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {prod?.name || "Unknown Product"}
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
                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                        Close
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
