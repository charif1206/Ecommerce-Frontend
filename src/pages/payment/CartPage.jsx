import axiosInstance from "@/Axios/AxiosInstance";
import {loadStripe} from "@stripe/stripe-js";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {FiMinus, FiPlus, FiShoppingBag, FiXCircle} from "react-icons/fi";
import {Link} from "react-router-dom";
import {toast} from "sonner";
import useAddToCart from "./hooks/useAddToCart";
import useCartData from "./hooks/useCartdata";
import useValidateCoupon from "./hooks/useValidateCoupon";
import useRemoveItem from "./hooks/useRemoveItem";

const stripePromise = loadStripe(
    "pk_test_51QL8tPE2SYKPhJCMl6nuNHAfpEvwZs3fnJXH0FxDwdp41tsoBMPf0aUM8UIflYhSSlX3ZoKJ4NnSPvpJg3wCvHIZ00TemcIYIK"
);

export default function CartPage() {
    const queryClient = useQueryClient();
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);

    // Fetch cart data
    const {data: cart, isLoading, isError} = useCartData();

    // Mutation: Increase item quantity
    const {mutate: addItem, isPending: isAdding} = useAddToCart();

    // Mutation: Decrease item quantity
    const {mutate: removeItem, isPending: isRemoving} = useRemoveItem();

    // Mutation: Remove all units of an item from the cart
    const {mutate: removeAllItems, isPending: isRemovingAll} = useMutation({
        mutationFn: (productId) => axiosInstance.delete("/cart/remove-all", {data: {productId}}),
        onSuccess: () => {
            queryClient.invalidateQueries(["cart"]);
            toast.success("Item removed from cart");
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to remove item"),
    });

    // Mutation: Validate coupon via API
    const {mutate: validateCoupon} = useValidateCoupon(setDiscount);

    const applyCoupon = () => {
        if (cart && cart.totalPrice) {
            validateCoupon({code: couponCode, cartTotal: Number(cart.totalPrice)});
        }
    };

    // Payment handler: redirect to Stripe Checkout using the updated total
    const handlePayment = async () => {
        const stripe = await stripePromise;
        // Pass the updated total (subtotal - discount) and couponCode to the backend
        const res = await axiosInstance.post("/payments/create-checkout-session", {
            total: Number(cart?.totalPrice || 0) - discount,
            couponCode,
        });
        const session = res.data;
        const result = await stripe.redirectToCheckout({sessionId: session.id});
        if (result.error) {
            console.error("Error:", result.error);
        }
    };

    // Calculate order totals (convert to number to avoid NaN)
    const subtotal = Number(cart?.totalPrice) || 0;
    const total = subtotal - discount;

    if (isLoading)
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-lg p-6 shadow-sm h-32 bg-gray-100"
                                ></div>
                            ))}
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm h-fit space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );

    if (isError)
        return (
            <div className="min-h-screen bg-gray-50 py-12 text-center">
                <div className="container mx-auto px-4">
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                        Failed to load cart. Please try refreshing the page.
                    </div>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Cart Header */}
                <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <FiShoppingBag className="text-2xl" />
                    Shopping Cart
                    <span className="text-gray-500 text-sm font-normal">
                        ({cart?.items?.length || 0} items)
                    </span>
                </h1>

                {cart?.items?.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                        <div className="text-gray-400 text-6xl mb-4">🛒</div>
                        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                        <Link
                            to="/shop"
                            className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items Section */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart?.items?.map((item) => (
                                <div
                                    key={item.productId._id}
                                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {item.productId.productImages[0]?.url ? (
                                                <img
                                                    src={item.productId.productImages[0].url}
                                                    alt={item.productId.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <FiShoppingBag className="text-gray-400 text-xl" />
                                            )}
                                        </div>
                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold hover:text-gray-800 transition-colors">
                                                        <Link to={`/product/${item.productId._id}`}>
                                                            {item.productId.name}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">
                                                        ${item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                {/* Remove All Button */}
                                                <button
                                                    onClick={() =>
                                                        removeAllItems(item.productId._id)
                                                    }
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                    disabled={isRemovingAll}
                                                >
                                                    <FiXCircle className="text-xl" />
                                                </button>
                                            </div>
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3 mt-3">
                                                <button
                                                    onClick={() => removeItem(item.productId._id)}
                                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                    disabled={isRemoving}
                                                >
                                                    <FiMinus className="text-sm" />
                                                </button>
                                                <span className="w-8 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => addItem(item.productId._id)}
                                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                    disabled={isAdding}
                                                >
                                                    <FiPlus className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm h-fit sticky top-4">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FiShoppingBag className="text-xl" />
                                Order Summary
                            </h2>
                            <div className="space-y-3 text-sm">
                                {/* Pricing Breakdown */}
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>

                                {/* Total Price */}
                                <div className="border-t pt-3 mt-2">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span className="text-lg">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Coupon Code Input and Apply */}
                                <div className="border-t border-b py-4 mt-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) =>
                                                setCouponCode(e.target.value.toUpperCase())
                                            }
                                            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600 mt-2 text-sm">
                                            <span>Discount Applied</span>
                                            <span>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handlePayment}
                                    className="w-full bg-black text-white py-3 rounded-lg mt-4 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout
                                    <FiShoppingBag />
                                </button>

                                <Link to="/shop">
                                    <button className="w-full border border-gray-200 py-3 rounded-lg mt-2 hover:bg-gray-50 transition-colors">
                                        Continue Shopping
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
