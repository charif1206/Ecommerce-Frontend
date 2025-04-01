import {useQuery} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import useCartStore from "@/zustand/cartStore";

const useCartData = () => {
    const setCartItems = useCartStore((state) => state.setCartItems);

    return useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const response = await axiosInstance.get("/cart");
            setCartItems(response.data.items);
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
};

export default useCartData;
