import {useQuery} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import ProductCard from "@/components/ui/tailwind/ProductCard";
import {useParams} from "react-router-dom";

export default function ProfileWishlist() {
    const {id: userId} = useParams();

    // Fetch favorite products when the component mounts
    const {data, isLoading, isError, error} = useQuery({
        queryKey: ["favoriteProducts", userId],
        queryFn: async () => {
            const response = await axiosInstance.get("/products/favorites");
            // Assuming response.data.products is an array of product objects
            return response.data.products;
        },
    });

    if (isLoading) {
        return <div className="p-8">Loading favorite products...</div>;
    }

    if (isError) {
        return (
            <div className="p-8 text-red-500">
                Error fetching favorite products: {error.message}
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-6">Wishlist</h1>
            {data && data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {data.map((product) => (
                        <ProductCard key={product._id} {...product} />
                    ))}
                </div>
            ) : (
                <div>No favorite products found.</div>
            )}
        </div>
    );
}
