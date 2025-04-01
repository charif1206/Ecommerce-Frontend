import {useMutation, useQueryClient} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import {toast} from "sonner";

const useRemoveItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId) => axiosInstance.patch("/cart/remove", {productId}),
        onSuccess: () => {
            queryClient.invalidateQueries(["cart"]);
            toast.dismiss();
            toast.success("Item quantity decreased");
        },
        onError: (error) => {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Failed to update cart");
        },
    });
};

export default useRemoveItem;