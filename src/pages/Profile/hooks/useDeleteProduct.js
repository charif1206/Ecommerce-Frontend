import axiosInstance from "@/Axios/AxiosInstance";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export const useDeleteProduct = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId) => {
            const response = await axiosInstance.delete(`/products/${productId}`);
            return response.data;
        },
        onSuccess: () => queryClient.invalidateQueries(["sellerProducts", userId]),
        onError: (error) => console.error("Error deleting product:", error),
    });
};
