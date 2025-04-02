import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {CiSearch} from "react-icons/ci";
import {ImSpinner8} from "react-icons/im";
import {useQuery} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import useProductStore from "@/zustand/ProductsStore";
import {Input} from "@/components/ui/input";

const fetchProducts = async (searchQuery) => {
    const {data} = await axiosInstance.get("/products", {
        params: {searchQuery},
    });
    return data;
};

export default function NavBar({onLinkClick}) {
    const navigate = useNavigate();
    const searchQuery = useProductStore((state) => state.searchQuery);
    const setSearchQueryValue = useProductStore((state) => state.setSearchQueryValue);
    const setSearchProducts = useProductStore((state) => state.setSearchProducts);
    const searchProducts = useProductStore((state) => state.searchProducts);

    const [isResultsOpen, setIsResultsOpen] = useState(false);

    // React Query for fetching products
    const {
        data: products,
        isFetching,
        error,
    } = useQuery({
        queryKey: ["products", searchQuery],
        queryFn: () => fetchProducts(searchQuery),
        enabled: searchQuery.length > 0,
    });

    // Update products in store when query results change
    useEffect(() => {
        if (products && Array.isArray(products.products)) {
            setSearchProducts(products.products);
        }
    }, [products, setSearchProducts]);

    // Handle clicks outside the search component
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".search-container")) {
                setIsResultsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        setSearchQueryValue(e.target.value);
        setIsResultsOpen(true);
        if (e.target.value.trim()) {
            navigate("/shop");
        }
    };

    // Handle product selection
    const handleProductSelect = (productName) => {
        setSearchQueryValue(productName);
        setIsResultsOpen(false);
        if (onLinkClick) onLinkClick();
    };

    return (
        <div className="relative search-container w-full">
            <div className="relative">
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-12 h-14 text-lg"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => setIsResultsOpen(true)}
                    aria-label="Search products"
                />
                <CiSearch
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={24}
                />
                {isFetching && (
                    <ImSpinner8
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
                        size={24}
                    />
                )}
            </div>

            {isResultsOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50">
                    {error ? (
                        <div className="p-4 text-red-500 text-sm">
                            Error loading results. Please try again.
                        </div>
                    ) : searchProducts?.length > 0 ? (
                        <ul className="max-h-96 overflow-y-auto">
                            {searchProducts.map((product) => (
                                <li
                                    key={product._id}
                                    className="p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 cursor-pointer"
                                    onClick={() => handleProductSelect(product.name)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {product.category}
                                            </p>
                                        </div>
                                        <span className="text-blue-600 font-medium">
                                            ${product.price}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        searchQuery.length > 0 &&
                        !isFetching && (
                            <div className="p-4 text-gray-500 text-sm">
                                No products found for {searchQuery}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
