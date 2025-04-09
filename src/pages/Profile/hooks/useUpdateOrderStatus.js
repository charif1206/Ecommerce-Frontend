import axiosInstance from "@/Axios/AxiosInstance";
import {useMutation, useQueryClient} from "@tanstack/react-query";

const useUpdateOrderStatus = (user) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({orderId, status}) => {
            const response = await axiosInstance.patch(`/orders/${orderId}/status`, {status});
            return response.data.order;
        },
        onSuccess: () => queryClient.invalidateQueries(["orders", user?._id]),
    });
};

export default useUpdateOrderStatus;