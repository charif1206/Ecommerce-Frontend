import {useMutation, useQueryClient} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import useCartStore from "@/zustand/cartStore";
import {toast} from "sonner";

const useAddToCart = (productId, quantity) => {
    const queryClient = useQueryClient();
    const {setCartItems} = useCartStore();

    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post("/cart/add", {productId, quantity});
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Product added to cart!");
            setCartItems(data.items);
            localStorage.setItem("cartItems", JSON.stringify(data.items));
            queryClient.invalidateQueries({queryKey: ["cart"]});
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to add to cart");
        },
    });
};

export default useAddToCart;
