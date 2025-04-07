import {useMutation, useQueryClient} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import useCartStore from "@/zustand/cartStore";
import {toast} from "sonner";

const useAddToCart = (productId) => {
    // Remove quantity from hook parameters
    const queryClient = useQueryClient();
    const {setCartItems} = useCartStore();

    return useMutation({
        mutationFn: async ({quantity}) => {
            // Accept quantity in mutationFn
            const response = await axiosInstance.post("/cart/add", {
                productId,
                quantity, // Now properly sending the quantity
            });
            return response.data;
        },
        onSuccess: (data) => {
            setCartItems(data.items);
            localStorage.setItem("cartItems", JSON.stringify(data.items));
            queryClient.invalidateQueries({queryKey: ["cart"]});
            toast.dismiss();
            toast.success("Product added to cart!");
        },
        onError: (error) => {
            console.log(error);
            toast.dismiss();
            toast.error(error.response?.data?.message || "Failed to add to cart");
        },
    });
};

export default useAddToCart;
