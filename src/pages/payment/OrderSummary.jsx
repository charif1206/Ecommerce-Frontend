import {FiShoppingBag} from "react-icons/fi";
import {Link} from "react-router-dom";

export default function OrderSummary({
    subtotal, // Total cart value before discount
    discount, // Discount amount from applied coupon
    couponCode, // Current coupon code input value
    setCouponCode, // Function to update coupon code
    applyCoupon, // Function to validate and apply coupon
    handlePayment, // Function to process payment
    isProcessing, // Loading state for payment processing
}) {
    // Calculate final total after discount
    const total = subtotal - discount;

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm h-fit sticky top-4">
            {/* Summary header */}
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiShoppingBag className="text-xl" />
                Order Summary
            </h2>

            <div className="space-y-3 text-sm">
                {/* Cart subtotal display */}
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {/* Final total display */}
                <div className="border-t pt-3 mt-2">
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-lg">${total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Coupon code section */}
                <div className="border-t border-b py-4 mt-3">
                    <div className="flex gap-2">
                        {/* Coupon input field - converts input to uppercase */}
                        <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />

                        {/* Apply coupon button */}
                        <button
                            onClick={applyCoupon}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm transition-colors"
                        >
                            Apply
                        </button>
                    </div>

                    {/* Conditionally show discount information if a coupon is applied */}
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600 mt-2 text-sm">
                            <span>Discount Applied</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                {/* Checkout button with loading state */}
                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-black text-white py-3 rounded-lg mt-4 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <>
                            {/* Loading spinner animation */}
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            {/* Default button label */}
                            Proceed to Checkout
                            <FiShoppingBag />
                        </>
                    )}
                </button>

                {/* Continue shopping link - returns user to shop page */}
                <Link to="/shop">
                    <button className="w-full border border-gray-200 py-3 rounded-lg mt-2 hover:bg-gray-50 transition-colors">
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>
    );
}
