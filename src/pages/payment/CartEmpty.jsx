import {Link} from "react-router-dom";

export default function CartEmpty() {
    return (
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
    );
}
