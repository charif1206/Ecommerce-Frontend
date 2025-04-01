import {useMutation, useQueryClient} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import useCartStore from "@/zustand/cartStore";
import {toast} from "sonner";

const useAddToCart = () => {
    const cartItems = useCartStore((state) => state.cartItems);
    const setCartItems = useCartStore((state) => state.setCartItems);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId) => {
            const response = await axiosInstance.post("/cart/add", {productId, quantity: 1});
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["cart"]);
            toast.dismiss();
            toast.success("Item quantity increased");
        },
        onError: (error, productId) => {
            try {
                setCartItems(
                    cartItems?.map((item) =>
                        item.productId._id === productId
                            ? {...item, quantity: item.quantity - 1}
                            : item
                    ) || []
                );
            } catch (mapError) {
                console.error("Error rolling back cart:", mapError);
            }
            toast.dismiss();
            toast.error(error.response?.data?.message || "Failed to update cart");
        },
    });
};

export default useAddToCart;
