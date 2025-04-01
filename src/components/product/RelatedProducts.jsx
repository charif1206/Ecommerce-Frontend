import axiosInstance from "@/Axios/AxiosInstance";
import ProductCard from "@/components/ui/tailwind/ProductCard";
import {useQuery} from "@tanstack/react-query";

export default function RelatedProducts({product}) {
    const {
        data: relatedProducts,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["relatedProducts", product?.category, product?._id],
        queryFn: async () => {
            const response = await axiosInstance.get("/products", {
                params: {
                    categories: product?.category,
                    limit: 16, // Fetch exactly 16 products
                    exclude: product?._id, // Exclude current product (assuming API supports this)
                },
            });
            return response.data.products.filter((prod) => prod._id !== product._id);
        },
        enabled: !!product?.category,
        refetchOnWindowFocus: false,
    });

    if (isLoading) return <div>Loading related products...</div>;
    if (isError) return <div>Error loading related products</div>;
    if (!relatedProducts?.length) return <div>No related products found</div>;

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 16).map((prod) => (
                    <ProductCard key={prod._id} {...prod} />
                ))}
            </div>
        </div>
    );
}
