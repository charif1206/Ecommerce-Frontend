import {useMutation, useQueryClient} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import {toast} from "sonner";

const useToggleLike = (productId, setLikeCount, setIsLiked) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.put(`/products/like/${productId}`);
            return response.data;
        },
        onSuccess: (data) => {
            setLikeCount(data.likes.length);
            setIsLiked((prev) => !prev);
            queryClient.invalidateQueries({queryKey: ["product", productId]});
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update like");
        },
    });
};

export default useToggleLike;
