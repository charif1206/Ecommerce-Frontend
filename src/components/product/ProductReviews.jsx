import axiosInstance from "@/Axios/AxiosInstance";
import useAuthStore from "@/zustand/authStore";
import {useInfiniteQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {useParams} from "react-router-dom";
import {toast} from "sonner";
import {Trash, Edit, Save, X} from "lucide-react";

const REVIEWS_PER_PAGE = 5;

export default function ProductReviews() {
    const {id: productId} = useParams();
    const queryClient = useQueryClient();
    const authUser = useAuthStore((state) => state.user);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");

    const {
        data: reviewData,
        error,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["Reviews", productId],
        queryFn: async ({pageParam = 1}) => {
            const response = await axiosInstance.get(`/reviews/${productId}`, {
                params: {
                    page: pageParam,
                    limit: REVIEWS_PER_PAGE,
                },
            });
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.page + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
    });

    const postReviewMutation = useMutation({
        mutationFn: async (newReview) => {
            const response = await axiosInstance.post(`/reviews/${productId}`, newReview);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["Reviews", productId]);
            setRating(0);
            setComment("");
            toast.success("Review submitted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to submit review");
        },
    });

    const deleteReviewMutation = useMutation({
        mutationFn: async (reviewId) => {
            await axiosInstance.delete(`/reviews/${reviewId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["Reviews", productId]);
            toast.success("Review deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete review");
        },
    });

    const updateReviewMutation = useMutation({
        mutationFn: async ({reviewId, rating, comment}) => {
            const response = await axiosInstance.put(`/reviews/${reviewId}`, {
                rating,
                comment,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["Reviews", productId]);
            toast.success("Review updated successfully");
            setEditingReviewId(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update review");
        },
    });

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.info("Please select a rating");
            return;
        }
        const newReview = {
            rating,
            comment,
        };
        postReviewMutation.mutate(newReview);
    };

    const handleDeleteReview = (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            deleteReviewMutation.mutate(reviewId);
        }
    };

    const handleEditReview = (review) => {
        setEditingReviewId(review._id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };

    const handleCancelEdit = () => {
        setEditingReviewId(null);
        setEditRating(0);
        setEditComment("");
    };

    const handleUpdateReview = (reviewId) => {
        if (editRating === 0) {
            toast.info("Please select a rating");
            return;
        }
        updateReviewMutation.mutate({
            reviewId,
            rating: editRating,
            comment: editComment,
        });
    };

    if (isLoading) return <div>Loading reviews...</div>;
    if (error) return <div>Error loading reviews: {error.message}</div>;

    const allReviews = reviewData.pages.flatMap((page) => page.reviews);
    const sortedReviews = [...allReviews].sort((a, b) => {
        if (a.user?._id === authUser?._id) return -1;
        if (b.user?._id === authUser?._id) return 1;
        return 0;
    });

    const handleLoadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-2xl ${
                                    star <= rating ? "text-yellow-400" : "text-gray-300"
                                }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Your Review</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        rows="4"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                    Submit Review
                </button>
            </form>

            <div className="space-y-4">
                {sortedReviews.map((review) => (
                    <div key={review._id} className="border-b pb-4 my-4 relative group">
                        {review.user?._id === authUser?._id && (
                            <div className="absolute bottom-2 right-2 flex gap-2">
                                {editingReviewId !== review._id ? (
                                    <>
                                        <button
                                            onClick={() => handleEditReview(review)}
                                            className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-50"
                                            title="Edit review"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReview(review._id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                                            title="Delete review"
                                        >
                                            <Trash className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateReview(review._id)}
                                            className="text-gray-400 hover:text-green-500 transition-colors p-1 rounded-full hover:bg-green-50"
                                            title="Save changes"
                                            disabled={updateReviewMutation.isLoading}
                                        >
                                            <Save className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                                            title="Cancel edit"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <img
                                        src={
                                            review.user?.profilePicture?.url ||
                                            "/default-avatar.png"
                                        }
                                        alt={review.user?.username || "Anonymous"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="font-medium">
                                    {review.user?.username || "Anonymous"}
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        {editingReviewId === review._id ? (
                            <div className="mt-4 space-y-4">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setEditRating(star)}
                                            className={`text-2xl ${
                                                star <= editRating
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    rows="4"
                                    required
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex text-yellow-400 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-lg">
                                            {i < review.rating ? "★" : "☆"}
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-2 text-gray-700">{review.comment}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {hasNextPage && (
                <div className="flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isFetchingNextPage}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isFetchingNextPage ? "Loading more reviews..." : "Load More"}
                    </button>
                </div>
            )}

            {!hasNextPage && <div className="text-center text-gray-500 mt-4">No more reviews</div>}
        </div>
    );
}
