import axiosInstance from "@/Axios/AxiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { toast } from "sonner";
import CartEmpty from "./CartEmpty";
import CartError from "./CartError";
import CartItem from "./CartItem";
import CartLoading from "./CartLoading";
import useAddToCart from "./hooks/useAddToCart";
import useCartData from "./hooks/useCartData";
import useRemoveItem from "./hooks/useRemoveItem";
import useValidateCoupon from "./hooks/useValidateCoupon";
import OrderSummary from "./OrderSummary";

const stripePromise = loadStripe(
    "pk_test_51QL8tPE2SYKPhJCMl6nuNHAfpEvwZs3fnJXH0FxDwdp41tsoBMPf0aUM8UIflYhSSlX3ZoKJ4NnSPvpJg3wCvHIZ00TemcIYIK"
);

export default function CartPage() {
    const queryClient = useQueryClient();
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

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
        setIsProcessing(true);
        try {
            const stripe = await stripePromise;
            const res = await axiosInstance.post("/payments/create-checkout-session", {
                total: Number(cart?.totalPrice || 0) - discount,
                couponCode,
            });
            const session = res.data;
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

    // Calculate order totals (convert to number to avoid NaN)
    const subtotal = Number(cart?.totalPrice) || 0;

    if (isLoading) return <CartLoading />;

    if (isError) return <CartError />;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <FiShoppingBag className="text-2xl" />
                    Shopping Cart
                    <span className="text-gray-500 text-sm font-normal">
                        ({cart?.items?.length || 0} items)
                    </span>
                </h1>

                {cart?.items?.length === 0 ? (
                    <CartEmpty />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
