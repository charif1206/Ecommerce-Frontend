import {keepPreviousData, useQuery} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";

const useHomeProduct = () => {
    return useQuery({
        queryKey: ["products", "home", {limit: "all"}],
        queryFn: () =>
            axiosInstance
                .get("/products", {
                    params: {limit: "all"},
                })
                .then((res) => res.data),
        placeholderData: keepPreviousData,
    });
};

export default useHomeProduct;
