// ManageOrders.jsx
import axiosInstance from "@/Axios/AxiosInstance";
import OrderDetailsModal from "@/components/manageOrder/OrderDetailsModal";
import OrderFilters from "@/components/manageOrder/OrderFilters";
import OrderTable from "@/components/manageOrder/OrderTable";
import useAuthStore from "@/zustand/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";


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
        <div className="min-h-screen ">
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
