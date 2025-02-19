// src/components/Shop.jsx
import axiosInstance from "@/Axios/AxiosInstance";
import Pagination from "@/components/ui/Pagination";
import ProductCard from "@/components/ui/tailwind/ProductCard";
import categoriesa from "@/fakeData/categories.js";
import useProductStore from "@/zustand/ProductsStore";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {FiCheck} from "react-icons/fi";

// Mobile Filter Toggle Component
function MobileFilterToggle({isFilterOpen, setIsFilterOpen}) {
    return (
        <div className="lg:hidden w-full bg-white p-4 sticky top-0 z-10 shadow-md">
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 text-gray-600"
            >
                <span className="material-icons">filter_list</span>
                <span>Filter Products</span>
            </button>
        </div>
    );
}

// Filter Sidebar Component
function FilterSidebar({
    isFilterOpen,
    selectedCategories,
    handleCategoryChange,
    sortOrder,
    handleSortChange,
}) {
    return (
        <div
            className={`bg-white shadow-lg lg:w-64 lg:block lg:sticky lg:top-0 lg:h-screen ${
                isFilterOpen ? "block" : "hidden"
            }`}
        >
            <div className="p-6 space-y-6">
                {/* Categories Filter */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
                    <div className="space-y-2">
                        {categoriesa.map((category) => (
                            <label
                                key={category.id}
                                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedCategories.includes(category.name)}
                                    onChange={() => handleCategoryChange(category.name)}
                                />
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-md mr-3 flex items-center justify-center">
                                    {selectedCategories.includes(category.name) && (
                                        <FiCheck className="w-4 h-4 text-blue-600" />
                                    )}
                                </div>
                                <span className="text-gray-700">{category.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Sort Order */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Sort By</h3>
                    <div className="relative">
                        <select
                            value={sortOrder}
                            onChange={handleSortChange}
                            className="block w-full pl-4 pr-10 py-2.5 text-base border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                            <option value="asc">Price: Low to High</option>
                            <option value="desc">Price: High to Low</option>
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Product Grid Component
function ProductGrid({products, currentPage, totalPages, handlePageChange}) {
    const safeProducts = products || [];
    return (
        <div className="flex-1 mx-auto container px-2 sm:px-6 lg:px-4">
            <div className="py-3 sm:py-4 md:py-5 lg:py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 lg:gap-5">
                    {safeProducts.map((product, index) => (
                        <ProductCard key={index} {...product} />
                    ))}
                </div>
                {/* Pagination */}
                <div className="mt-10 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}

const fetchProducts = async ({queryKey}) => {
    const [, page, {categories, sortOrder, searchQuery, productsPerPage}] = queryKey;

    const params = {
        page,
        limit: productsPerPage, // <-- Pass the product per page as limit
        categories: categories.join(","),
        sortBy: sortOrder.includes("reviews") ? "reviews" : "price",
        sortOrder,
        searchQuery,
    };

    try {
        const response = await axiosInstance.get("/products", {params});
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching products");
    }
};

// Main Shop Component
export default function Shop() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("asc");
    const productsPerPage = 12;
    const setProducts = useProductStore((state) => state.setProducts);
    const products = useProductStore((state) => state.products);
    const searchQuery = useProductStore((state) => state.searchQuery);

    const {data, isLoading, isError, error} = useQuery({
        queryKey: [
            "products",
            currentPage,
            {categories: selectedCategories, sortOrder, searchQuery, productsPerPage},
        ],
        queryFn: fetchProducts,
        placeholderData: keepPreviousData,
        retry: 1,
    });

    useEffect(() => {
        if (data && Array.isArray(data.products)) {
            setProducts(data.products);
        }
    }, [data, setProducts]);

    const totalProducts = data ? data.totalProducts : 0;
    const totalPages = totalProducts ? Math.ceil(totalProducts / productsPerPage) : 1;

    // Filter handlers
    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    // Handle sorting order change
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <MobileFilterToggle isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />
            <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
                <FilterSidebar
                    isFilterOpen={isFilterOpen}
                    selectedCategories={selectedCategories}
                    handleCategoryChange={handleCategoryChange}
                    sortOrder={sortOrder}
                    handleSortChange={handleSortChange}
                />
                {isError ? (
                    <div className="flex-1 text-center py-10 space-y-4">
                        <div className="text-red-500 text-xl font-semibold">
                            Oops! Something went wrong.
                        </div>
                        <p className="text-gray-600">
                            {error.message || "An error occurred while fetching products."}
                        </p>
                    </div>
                ) : isLoading ? (
                    <div className="flex-1 text-center py-10 space-y-4">
                        <div className="text-blue-500 text-xl font-semibold">
                            Loading products...
                        </div>
                        <div className="text-gray-600">
                            Please wait while we fetch the latest products.
                        </div>
                        <div className="mt-4">
                            <svg
                                className="w-8 h-8 mx-auto animate-spin text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="opacity-25"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 12a8 8 0 0116 0"
                                    className="opacity-75"
                                />
                            </svg>
                        </div>
                    </div>
                ) : (
                    <ProductGrid
                        products={products}
                        currentPage={currentPage}
                        totalPages={products.length > 0 ? totalPages : 1}
                        handlePageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}
