// OrderDetailsModal.jsx
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

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
