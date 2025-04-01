import {useMutation, useQueryClient} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import {toast} from "sonner";

const useToggleFavorite = (productId, setIsFavorited) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.put(`/products/favorite/${productId}`);
            return response.data;
        },
        onSuccess: () => {
            setIsFavorited((prev) => !prev);
            queryClient.invalidateQueries({queryKey: ["product", productId]});
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update favorite");
        },
    });
};

export default useToggleFavorite;
