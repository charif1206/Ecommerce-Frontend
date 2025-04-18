// IMPORTS SECTION
// Core dependencies and API client
import axiosInstance from "@/Axios/AxiosInstance";
import {loadStripe} from "@stripe/stripe-js";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {FiShoppingBag} from "react-icons/fi";
import {toast} from "sonner";

// Component imports
import CartEmpty from "./CartEmpty";
import CartError from "./CartError";
import CartItem from "./CartItem";
import CartLoading from "./CartLoading";

// Custom hooks
import useAddToCart from "./hooks/useAddToCart";
import useCartData from "./hooks/useCartData";
import useRemoveItem from "./hooks/useRemoveItem";
import useValidateCoupon from "./hooks/useValidateCoupon";
import OrderSummary from "./OrderSummary";

// Initialize Stripe payment integration with the public key
const stripePromise = loadStripe(
    "pk_test_51QL8tPE2SYKPhJCMl6nuNHAfpEvwZs3fnJXH0FxDwdp41tsoBMPf0aUM8UIflYhSSlX3ZoKJ4NnSPvpJg3wCvHIZ00TemcIYIK"
);

export default function CartPage() {
    // STATE MANAGEMENT
    const queryClient = useQueryClient();
    const [couponCode, setCouponCode] = useState(""); // For storing coupon input
    const [discount, setDiscount] = useState(0); // For storing discount amount
    const [isProcessing, setIsProcessing] = useState(false); // Payment processing status

    // CART DATA FETCHING
    // Fetch cart details with loading and error states
    const {data: cart, isLoading, isError} = useCartData();

    // CART MUTATION OPERATIONS
    // Add item to cart mutation
    const {mutate: addItem, isPending: isAdding} = useAddToCart();

    // Remove item from cart mutation
    const {mutate: removeItem, isPending: isRemoving} = useRemoveItem();

    // Remove all instances of an item from cart
    const {mutate: removeAllItems, isPending: isRemovingAll} = useMutation({
        mutationFn: (productId) => axiosInstance.delete("/cart/remove-all", {data: {productId}}),
        onSuccess: () => {
            queryClient.invalidateQueries(["cart"]); // Refresh cart data
            toast.success("Item removed from cart");
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to remove item"),
    });

    // COUPON AND PAYMENT HANDLING
    // Validate coupon code
    const {mutate: validateCoupon} = useValidateCoupon(setDiscount);

    // Apply coupon code to cart
    const applyCoupon = () => {
        if (cart && cart.totalPrice) {
            validateCoupon({code: couponCode, cartTotal: Number(cart.totalPrice)});
        }
    };

    // Handle payment submission via Stripe
    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            // Initialize Stripe and create checkout session
            const stripe = await stripePromise;
            const res = await axiosInstance.post("/payments/create-checkout-session", {
                total: Number(cart?.totalPrice || 0) - discount,
                couponCode,
            });
            const session = res.data;

            // Redirect to Stripe checkout page
            const result = await stripe.redirectToCheckout({sessionId: session.id});
            if (result.error) {
                toast.error("Payment failed: " + result.error.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment processing failed");
        } finally {
            setIsProcessing(false);
        }
    };

    // Calculate subtotal from cart data
    const subtotal = Number(cart?.totalPrice) || 0;

    // LOADING STATES
    // Show loading spinner while cart is being fetched
    if (isLoading) return <CartLoading />;

    // Show error component if cart fetch failed
    if (isError) return <CartError />;

    // COMPONENT RENDERING
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Cart header */}
                <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <FiShoppingBag className="text-2xl" />
                    Shopping Cart
                    <span className="text-gray-500 text-sm font-normal">
                        ({cart?.items?.length || 0} items)
                    </span>
                </h1>

                {/* Cart content - either empty state or items with summary */}
                {cart?.items?.length === 0 ? (
                    <CartEmpty />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left side - Cart items list */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart?.items?.map((item) => (
                                <CartItem
                                    key={item.productId._id}
                                    item={item}
                                    addItem={addItem}
                                    removeItem={removeItem}
                                    removeAllItems={removeAllItems}
                                    isAdding={isAdding}
                                    isRemoving={isRemoving}
                                    isRemovingAll={isRemovingAll}
                                />
                            ))}
                        </div>

                        {/* Right side - Order summary */}
                        <OrderSummary
                            subtotal={subtotal}
                            discount={discount}
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            applyCoupon={applyCoupon}
                            handlePayment={handlePayment}
                            isProcessing={isProcessing}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
