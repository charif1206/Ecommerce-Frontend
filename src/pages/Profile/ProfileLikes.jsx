// ProfileLikes page displays all products liked by the user
import {useQuery} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import ProductCard from "@/components/ui/tailwind/ProductCard";
import {useParams} from "react-router-dom";

export default function ProfileLikes() {
    // Get userId from URL params
    const {id: userId} = useParams();

    // Fetch liked products when the component mounts
    const {data, isLoading, isError, error} = useQuery({
        queryKey: ["likedProducts", userId],
        queryFn: async () => {
            const response = await axiosInstance.get("/products/liked");
            // Assuming response.data.products is an array of product objects
            return response.data.products;
        },
    });

    // Loading state
    if (isLoading) {
        return <div className="p-8">Loading liked products...</div>;
    }

    // Error state
    if (isError) {
        return (
            <div className="p-8 text-red-500">Error fetching liked products: {error.message}</div>
        );
    }

    console.log(data);

    // Render liked products or fallback if none
    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-6">Liked Products</h1>
            {data && data.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {data.map((product) => (
                        <ProductCard key={product._id} {...product} />
                    ))}
                </div>
            ) : (
                <div>No liked products found.</div>
            )}
        </div>
    );
}
