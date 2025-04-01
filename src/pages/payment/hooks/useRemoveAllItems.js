import {useMutation} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import {toast} from "sonner";
import {useQueryClient} from "@tanstack/react-query";

const useRemoveAllItems = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId) => axiosInstance.delete("/cart/remove-all", {data: {productId}}),
        onSuccess: () => {
            queryClient.invalidateQueries(["cart"]);
            toast.dismiss();
            toast.success("Item removed from cart");
        },
        onError: (error) => {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Failed to remove item");
        },
    });
};

export default useRemoveAllItems;
