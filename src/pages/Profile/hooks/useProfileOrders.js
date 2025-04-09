import axiosInstance from "@/Axios/AxiosInstance";
import { useQuery } from "@tanstack/react-query";

const useProfileOrders = (user) => {
    return useQuery({
        queryKey: ["orders", user?._id],
        queryFn: async () => {
            const endpoint =
                user.roles === "seller" || user.roles === "admin"
                    ? "/orders/seller"
                    : "/orders/customer";
            const response = await axiosInstance.get(endpoint);
            return response.data.orders;
        },
        enabled: !!user,
    });
};

export default useProfileOrders;
