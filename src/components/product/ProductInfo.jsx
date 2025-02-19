import {Rating} from "@smastrom/react-rating";
import {useState} from "react";
import {FaStar, FaThumbsUp} from "react-icons/fa";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import {toast} from "sonner";
import useCartStore from "@/zustand/cartStore";
import useAuthStore from "@/zustand/authStore";

export default function ProductInfo({product, quantity, setQuantity}) {
    const setCartItems = useCartStore((state) => state.setCartItems);
    const user = useAuthStore((state) => state.user);

    const [isFavorite, setIsFavorite] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const queryClient = useQueryClient();

    // Add to Cart mutation
    const {mutate: addToCart, isPending} = useMutation({
        mutationFn: async () => {
            // Client-side validation before API call
            if (quantity > product.stock) {
                toast.error(`Only ${product.stock} items available`);
                return;
            }
            const response = await axiosInstance.post("/cart/add", {
                productId: product._id,
                quantity: quantity,
            });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ["cart"]});
            queryClient.invalidateQueries({queryKey: ["product", product._id]});
            setCartItems(data.items);

            toast.success(`${quantity} item(s) added to cart!`);
            setQuantity(1);
        },
        onError: (error) => {
            if (!user) {
                toast.error("Please login to add items to cart");
                return;
            }
            toast.error(error.response?.data?.message || "Failed to add to cart");
        },
    });

    // Handle quantity changes with instant feedback
    const handleQuantityChange = (newQuantity) => {
        const maxAllowed = product.stock;
        const clamped = Math.max(1, Math.min(newQuantity, maxAllowed));

        // Show warning if trying to exceed stock
        if (newQuantity > maxAllowed) {
            toast.warning(`Maximum ${maxAllowed} items available`);
        }

        setQuantity(clamped);
    };

    // Disable conditions
    const isOutOfStock = product.stock < 1;
    const exceedsStock = quantity > product.stock;
    const addButtonDisabled = isPending || isOutOfStock || exceedsStock;

    return (
        <div className="flex flex-col lg:justify-between">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                        <Rating style={{maxWidth: 120}} value={product.ratings.average} readOnly />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                        {product.ratings?.average?.toFixed(1) || "0.0"} (
                        {product?.ratings?.count || 0} reviews)
                    </span>
                </div>

                {/* Price */}
                <div className="text-3xl font-bold">{product.price}$</div>

                {/* Product Description */}
                <div className="text-gray-600 mt-4">
                    <p className="leading-relaxed">{product.description}</p>
                </div>
            </div>

            {/* Quantity Selector */}
            <div className="lg:mb-24">
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

                {/* Add to Cart Section */}
                <div className="flex gap-6 mt-6">
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

                    {/* Like Button with Effect */}
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-200 transform ${
                            isLiked ? "scale-110 bg-blue-500 text-white" : "scale-100"
                        } hover:scale-105 hover:bg-blue-200 active:scale-95`}
                        aria-label="Like this product"
                    >
                        <FaThumbsUp size={20} />
                    </button>

                    {/* Add to Favorites Button with Effect */}
                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-200 transform ${
                            isFavorite ? "scale-110 bg-yellow-400 text-white" : "scale-100"
                        } hover:scale-105 hover:bg-yellow-200 active:scale-95`}
                        aria-label="Add to favorites"
                    >
                        <FaStar size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
