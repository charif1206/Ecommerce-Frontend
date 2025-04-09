import axiosInstance from "@/Axios/AxiosInstance";
import {useQuery} from "@tanstack/react-query";

const useProfileProducts = (user) => {
    return useQuery({
        queryKey: ["sellerProducts", user._id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/products/seller/${user._id}`);
            return response.data.products;
        },
        enabled: !!user,
    });
};

export default useProfileProducts;
