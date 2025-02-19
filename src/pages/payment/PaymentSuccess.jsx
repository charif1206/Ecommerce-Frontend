import React from "react";
import { Link } from "react-router-dom";
import loginIllustration from "@/assets/Devices-bro.png";
export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Success Icon/Image */}
        <div className="mx-auto w-48 h-48 relative">
          <img
            src={loginIllustration}
            alt="Payment Success"
            className="w-full h-full"
          />
        </div>

        {/* Success Message */}
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">#ORD-2024-1234</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="border-t pt-3 mt-3">
              <p className="text-sm text-gray-600">
                We've sent a confirmation email to your registered email
                address.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link to="/shop">
            <button className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors">
              Continue Shopping
            </button>
          </Link>
          <Link to="/orders">
            <button className="w-full border border-gray-200 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              Track Order
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
