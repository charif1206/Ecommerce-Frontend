import axiosInstance from "@/Axios/AxiosInstance";
import ProductCard from "@/components/ui/tailwind/ProductCard";
import {useInfiniteQuery} from "@tanstack/react-query";

export default function RelatedProducts({product}) {
    const pageSize = 12; // Default page size

    // Infinite query to fetch products by category
    const {
        data: CategoryProducts,
        isLoading,
        isError,
        isFetching,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["CategoryProducts", product?.category],
        queryFn: async ({pageParam = 1}) => {
            if (!product?.category) {
                throw new Error("Category not found for the product");
            }
            const response = await axiosInstance.get("/products", {
                params: {
                    categories: product?.category, // Pass category for filtering
                    page: pageParam, // Use pageParam for pagination
                    limit: pageSize,
                },
            });
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            // Debug: Log lastPage to ensure it has expected properties
            return lastPage.currentPage < lastPage.totalPages
                ? lastPage.currentPage + 1
                : undefined;
        },
        enabled: !!product?.category,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
    });

    if (isLoading || isFetching) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading products</div>;
    }

    // Combine pages of products into a single array
    const products = CategoryProducts?.pages?.flatMap((page) => page.products) || [];

    // Exclude the current product from the related products list
    const filteredProducts = products.filter((prod) => prod._id !== product._id);

    console.log(filteredProducts);

    if (filteredProducts.length === 0) {
        return <div>No related products found</div>;
    }

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Interesting Products</h2>

            {/* Display Related Products using a responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((prod) => (
                    <ProductCard key={prod._id} {...prod} />
                ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
                <div className="flex justify-center mt-8">
                    <button
                        type="button"
                        onClick={() => fetchNextPage()}
                        disabled={isFetching}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isFetching ? "Loading more..." : "Load More"}
                    </button>
                </div>
            )}

            {!hasNextPage && <div className="text-center text-gray-500 mt-4">No more products</div>}
        </div>
    );
}
