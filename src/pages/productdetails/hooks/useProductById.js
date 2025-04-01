import axiosInstance from "@/Axios/AxiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchProductDetails = async (productId) => {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data; // Return the product data
};

const useProductById = (productId) => {
    // Use React Query's useQuery hook to fetch the product data
    return useQuery({
        queryKey: ["product", productId], // Query key with productId as a unique identifier
        queryFn: () => fetchProductDetails(productId), // The function to fetch data
        enabled: !!productId, // Ensure query runs only if productId is available
    });
};

export default useProductById;
