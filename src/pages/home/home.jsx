// Home page component displaying hero banner and top-rated products
import ProductCard from "@/components/ui/tailwind/ProductCard";
import {Link} from "react-router-dom";
import useHomeProduct from "./useHomeProduct";

export default function Home() {
    // Fetch products using React Query. Query key includes the page number.
    const {data, isLoading, error} = useHomeProduct();

    // Select and sort top-rated products
    const topRatedProducts = [...(data?.products || [])] // Clone array to avoid mutating original data
        .filter((p) => p.ratings?.average !== undefined) // Ensure rating exists
        .sort((a, b) => b.ratings.average - a.ratings.average) // Sort descending
        .slice(0, 8); // Get top 8 highest-rated products

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            {/* Hero Banner */}
            <div className="relative w-full h-[720px] mb-20 bg-[url('./assets/christopher-gower-m_HRfLhgABo-unsplash.jpg')] bg-cover bg-[90%_100%]">
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black opacity-70 z-10" />
                <div className="relative z-20 flex flex-col justify-center items-center h-full text-white container mx-auto">
                    <h1 className="text-5xl font-bold mb-4">DasTech store</h1>
                    <p className="text-lg sm:text-xl mb-8 text-center max-w-4xl px-6 sm:px-12 mx-auto leading-relaxed text-gray-300 font-inter">
                        Welcome to DasTech Store! 🚀 <br />
                        Your one-stop shop for the latest and greatest in phones, headphones, and
                        smartwatches. <br />
                        Discover top-rated products, unbeatable deals, and cutting-edge
                        technology—all in one place! 🔥
                    </p>

                    <Link to="/shop">
                        <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>

            {/* Products Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl  font-extrabold mb-6 text-gray-900 tracking-wide">
                    TOP RATED PRODUCTS
                </h2>

                {/* Error and Loading States */}
                {isLoading && <p>Loading products...</p>}
                {error && (
                    <p className="text-[#EF4444]">Error fetching products. Please try again.</p>
                )}

                {/* Product List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {topRatedProducts?.map((product) => (
                        <ProductCard key={product._id} {...product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
