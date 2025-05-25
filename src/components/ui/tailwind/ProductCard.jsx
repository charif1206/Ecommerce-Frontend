// Product card component for displaying product info, likes, and favorites
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Heart, Bookmark} from "lucide-react";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import useAuthStore from "@/zustand/authStore";
import {Rating} from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import axiosInstance from "@/Axios/AxiosInstance";
import {toast} from "sonner";

export default function ProductCard({
    _id,
    name,
    price,
    ratings = {average: 0, count: 0},
    productImages = [],
    seller = {},
    likes = [],
    favorites = [],
}) {
    const authUser = useAuthStore((state) => state.user);

    // Initialize local state based on props & authUser
    const [isLiked, setIsLiked] = useState(() => (authUser ? likes.includes(authUser._id) : false));
    const [likeCount, setLikeCount] = useState(likes.length);
    const [isFavorited, setIsFavorited] = useState(() =>
        authUser ? favorites.includes(authUser._id) : false
    );

    const queryClient = useQueryClient();

    // Resync local state when authUser, likes, or favorites change
    useEffect(() => {
        setIsLiked(authUser ? likes.includes(authUser._id) : false);
        setLikeCount(likes.length);
        setIsFavorited(authUser ? favorites.includes(authUser._id) : false);
    }, [authUser, likes, favorites]);

    // Mutation to toggle the like state
    // Mutation to update likes and sync with server/local state
    const toggleLikeMutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.put(`/products/like/${_id}`);
            return response.data;
        },
        // Update local state and invalidate product query
        onSuccess: (data) => {
            setLikeCount(data.likes);
            setIsLiked((prev) => !prev);
            queryClient.invalidateQueries({queryKey: ["product", _id]});
        },

        onError: (error) => {
            console.error("Error toggling like:", error);
        },
    });

    // Mutation to toggle the favorite state
    const toggleFavoriteMutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.put(`/products/favorite/${_id}`);
            return response.data;
        },
        onSuccess: () => {
            setIsFavorited((prev) => !prev);
        },
        onError: (error) => {
            console.error("Error toggling favorite:", error);
        },
    });

    // Handle like toggle with authentication check
    const handleLikeToggle = () => {
        if (!authUser) {
            toast.dismiss();
            toast.error("Please login to like this product");
            return;
        }
        toggleLikeMutation.mutate();
    };

    // Handle favorite toggle with authentication check
    const handleFavoriteToggle = () => {
        if (!authUser) {
            toast.dismiss();
            toast.error("please login to favorite this product");
            return;
        }
        toggleFavoriteMutation.mutate();
    };

    // Seller details
    const sellerImage = seller?.profilePicture?.url;
    const sellerName = seller?.username || "Unknown Seller";

    // Main product image or fallback
    const mainImage = productImages?.[0]?.url || "/fallback-image.jpg";

    return (
        <Card className="w-full rounded-lg shadow-lg relative hover:shadow-2xl">
            {/* Like & Favorite Buttons */}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
                {/* Like Button with Badge */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={toggleLikeMutation.isLoading}
                        className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-red-100/50 transition-colors"
                        onClick={handleLikeToggle}
                    >
                        <Heart
                            className={`h-5 w-5 transition-colors ${
                                isLiked ? "text-red-500 fill-red-500" : "text-gray-700"
                            }`}
                        />
                    </Button>
                    {likeCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                            {likeCount}
                        </span>
                    )}
                </div>

                {/* Favorite Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={toggleFavoriteMutation.isLoading}
                    className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-yellow-100/50 transition-colors"
                    onClick={handleFavoriteToggle}
                >
                    <Bookmark
                        className={`h-5 w-5 transition-colors ${
                            isFavorited ? "text-yellow-500 fill-yellow-500" : "text-gray-700"
                        }`}
                    />
                </Button>
            </div>

            {/* Link wrapping Image and Content */}
            <Link to={`/product/${_id}`} className="block">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img src={mainImage} alt={name} className="h-full w-full object-contain" />
                </div>

                <CardContent className="p-4">
                    <h2 className="text-xl font-bold">{name}</h2>
                    {/* Ratings & Price */}
                    <div className="mt-2 flex items-center">
                        <Rating value={ratings.average} readOnly style={{maxWidth: 100}} />
                        <span className="ml-2 text-sm text-gray-600">
                            {ratings.average?.toFixed(1) || "0.0"} ({ratings.count || 0} reviews)
                        </span>
                    </div>
                    <div className="mt-4">
                        <span className="text-xl font-bold">{price} $</span>
                    </div>
                </CardContent>
            </Link>

            {/* Seller Profile Footer */}
            <CardFooter className="border-t p-4">
                <Link to={`/profile/${seller?._id}`}>
                    <div className="flex items-center gap-3 cursor-pointer">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={sellerImage} alt={sellerName} />
                            <AvatarFallback>{sellerName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-700">
                            Sold by {sellerName}
                        </span>
                    </div>
                </Link>
            </CardFooter>
        </Card>
    );
}
