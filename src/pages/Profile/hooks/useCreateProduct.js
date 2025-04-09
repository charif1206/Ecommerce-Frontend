import axiosInstance from "@/Axios/AxiosInstance";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export const useCreateProduct = (userId, setIsCreateDialogOpen) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData) => {
            const response = await axiosInstance.post("/products", formData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["sellerProducts", userId]);
            setIsCreateDialogOpen(false);
        },
        onError: (error) => {
            console.error("Error creating product:", error);
        },
    });
};
