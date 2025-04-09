import axiosInstance from "@/Axios/AxiosInstance";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export const useUpdateProduct = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({productId, data}) => {
            const response = await axiosInstance.patch(`/products/${productId}`, data);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries(["sellerProducts", userId]),
    });
};
