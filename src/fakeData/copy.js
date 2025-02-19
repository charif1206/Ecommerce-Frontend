import ProductCard from "@/components/ui/tailwind/ProductCard";
import Pagination from "@/components/ui/Pagination";
import React, { useState } from "react";
import catgories from "@/fakeData/categories";
import products from "@/fakeData/products";
import testimg from "@/assets/Leonardo_Phoenix_create_a_highly_detailed_image_of_a_sleek_and_2.jpg";

export default function Shop() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination settings
  const productsPerPage = 12;
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedRatings, setSelectedRatings] = useState([]);

  // Filter handlers
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (type, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const applyFilters = () => {
    // Here you would typically make an API call with the filter parameters
    const filters = {
      categories: selectedCategories,
      price: priceRange,
      ratings: selectedRatings,
    };
    console.log("Applying filters:", filters);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="min-h-screen  bg-slate-100">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden w-full bg-white p-4 sticky top-0 z-10 shadow-md">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 text-gray-600"
          >
            <span className="material-icons">filter_list</span>
            <span>Filter Products</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
          {/* Sidebar */}
          <div
            className={`
          bg-white shadow-lg
          lg:w-64 lg:block lg:sticky lg:top-0 lg:h-screen
          ${isFilterOpen ? "block" : "hidden"}
        `}
          >
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-bold mb-4">Filter</h2>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Product Categories</h3>
                {catgories.map((category) => (
                  <div key={category.name} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryChange(category.name)}
                    />
                    <label>{category.name}</label>
                  </div>
                ))}
              </div>
              {/* Filter by Price */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Filter By Price</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="From"
                    className="w-20 p-1 border rounded"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                  />
                  <span>To</span>
                  <input
                    type="number"
                    placeholder="To"
                    className="w-20 p-1 border rounded"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                  />
                </div>
                <button
                  className="mt-2 px-4 py-1 bg-black text-white rounded text-sm"
                  onClick={applyFilters}
                >
                  filter
                </button>
              </div>
              {/* Rating Filter */}
              <div>
                <h3 className="font-semibold mb-2">Rating</h3>
                {[5, 4, 3, 2].map((stars) => (
                  <div key={stars} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedRatings.includes(stars)}
                      onChange={() => handleRatingChange(stars)}
                    />
                    <div className="flex text-yellow-500">
                      {[...Array(stars)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 mx-auto container">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product, index) => (
                  <ProductCard key={index} {...product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
