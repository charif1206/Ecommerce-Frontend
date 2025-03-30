import axiosInstance from "@/Axios/AxiosInstance";
import useAuthStore from "@/zustand/authStore";
import { Rating } from "@smastrom/react-rating";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { toast } from "sonner";

export default function ProductInfo({product, quantity, setQuantity, addToCart, isPending}) {
    const user = useAuthStore((state) => state.user);
    const queryClient = useQueryClient();

    // Initialize local state based on incoming product props and user
    const [isLiked, setIsLiked] = useState(() => (user ? product.likes.includes(user._id) : false));
    const [likeCount, setLikeCount] = useState(product.likes.length);
    const [isFavorited, setIsFavorited] = useState(() =>
        user ? product.favorites.includes(user._id) : false
    );

    // Mutation to toggle like
    const likeMutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.put(`/products/like/${product._id}`);
            return response.data;
        },
        onSuccess: (data) => {
            // Assume API returns the updated likes array
            setLikeCount(data.likes.length);
            setIsLiked((prev) => !prev);
            queryClient.invalidateQueries({queryKey: ["product", product._id]});
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update like");
        },
    });

    // Mutation to toggle favorite
    const favoriteMutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.put(`/products/favorite/${product._id}`);
            return response.data;
        },
        onSuccess: () => {
            setIsFavorited((prev) => !prev);
            queryClient.invalidateQueries({queryKey: ["product", product._id]});
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update favorite");
        },
    });

    // Resync local state when authUser, likes, or favorites change
    useEffect(() => {
        if (user) {
            setIsLiked(product.likes.includes(user._id));
            setLikeCount(product.likes.length);
            setIsFavorited(product.favorites.includes(user._id));
        }
    }, [user, product.likes, product.favorites]);

    // Handle like toggle
    const handleLikeToggle = () => {
        if (!user) {
            toast.dismiss();
            toast.error("Please login to like this product");
            return;
        }
        likeMutation.mutate();
    };

    // Handle favorite toggle
    const handleFavoriteToggle = () => {
        if (!user) {
            toast.dismiss();
            toast.error("Please login to favorite this product");
            return;
        }
        favoriteMutation.mutate();
    };

    // Quantity change remains the same
    const handleQuantityChange = (newQuantity) => {
        const maxAllowed = product.stock;
        const clamped = Math.max(1, Math.min(newQuantity, maxAllowed));
        if (newQuantity > maxAllowed) {
            toast.warning(`Only ${maxAllowed} items available`);
        }
        setQuantity(clamped);
    };

    const isOutOfStock = product.stock < 1;
    const exceedsStock = quantity > product.stock;
    const addButtonDisabled = isPending || isOutOfStock || exceedsStock;

    return (
        <div className="flex flex-col lg:justify-between">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>

                {/* Rating Section */}
                <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                        <Rating style={{maxWidth: 120}} value={product.ratings.average} readOnly />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                        {product.ratings?.average?.toFixed(1) || "0.0"} (
                        {product.ratings.count || 0} reviews)
                    </span>
                </div>

                {/* Price Section */}
                <div className="text-3xl font-bold">{product.price}$</div>

                {/* Description */}
                <div className="text-gray-600 mt-4">
                    <p className="leading-relaxed">{product.description}</p>
                </div>
            </div>

            {/* Quantity Selector and Action Buttons */}
            <div className="lg:mb-24">
                {/* Quantity Selector */}
                <div className="flex mt-4 items-center gap-4">
                    <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
                        disabled={quantity <= 1}
                    >
                        -
                    </button>
                    <span className="w-12 text-center">{quantity}</span>
                    <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
                        disabled={quantity >= product.stock}
                    >
                        +
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-6 mt-6">
                    {/* Add to Cart Button */}
                    <button
                        onClick={() => addToCart()}
                        disabled={addButtonDisabled}
                        className={`flex-1 py-3 rounded-lg transition-colors ease-in-out duration-200 ${
                            addButtonDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black hover:bg-gray-800 text-white"
                        }`}
                    >
                        {isOutOfStock
                            ? "Out of Stock"
                            : exceedsStock
                            ? `Max ${product.stock} allowed`
                            : isPending
                            ? "Adding..."
                            : `Add ${quantity} to Cart`}
                    </button>

                    {/* Like Button */}
                    <button
                        onClick={handleLikeToggle}
                        className="relative w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 hover:bg-red-100 active:scale-95"
                        aria-label="Like this product"
                    >
                        {isLiked ? (
                            <FaHeart className="h-5 w-5 text-red-500" />
                        ) : (
                            <FaRegHeart className="h-5 w-5 text-gray-700" />
                        )}
                        {likeCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                                {likeCount}
                            </span>
                        )}
                    </button>

                    {/* Favorite Button */}
                    <button
                        onClick={handleFavoriteToggle}
                        className="w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 hover:bg-yellow-100 active:scale-95"
                        aria-label="Add to favorites"
                    >
                        {isFavorited ? (
                            <FaBookmark className="h-5 w-5 text-yellow-500" />
                        ) : (
                            <FaRegBookmark className="h-5 w-5 text-gray-700" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
