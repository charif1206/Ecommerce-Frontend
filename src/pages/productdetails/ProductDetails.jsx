import ImageGallery from "@/components/product/ImageGallery";
import ProductDetails from "@/components/product/ProductDetails";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProductById from "./hooks/useProductById";

// Fetch product data from the backend

export default function ProductDetailsPage() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("details");

    // Extract productId from the URL (use the appropriate method depending on your routing setup)
    const {id} = useParams();

    const productId = id;

    // Use React Query's useQuery hook to fetch the product data
    const {data: product, isLoading, error} = useProductById(productId);

    useEffect(() => {
        // Smooth scroll to the top of the page whenever the URL changes
        window.scrollTo({top: 0, behavior: "smooth"});
    }, [productId]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching product details: {error.message}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Product Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <ImageGallery
                    images={product.productImages} // Using the fetched product images
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                />
                <ProductInfo
                    product={product} // Pass the fetched product details
                    quantity={quantity}
                    setQuantity={setQuantity}
                />
            </div>

            {/* Reviews Section */}
            <div className="space-y-8">
                {/* Tabs */}
                <div className="border-b">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`px-4 py-2 border-b-2 transition-colors ${
                                activeTab === "details" ? "border-black" : "border-transparent"
                            }`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`px-4 py-2 border-b-2 transition-colors ${
                                activeTab === "reviews" ? "border-black" : "border-transparent"
                            }`}
                        >
                            Reviews
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "details" ? (
                    <ProductDetails product={product} />
                ) : (
                    <ProductReviews />
                )}
            </div>

            <RelatedProducts product={product} currentProductId={productId} />
        </div>
    );
}
