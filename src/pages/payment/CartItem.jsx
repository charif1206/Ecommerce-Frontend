// Import necessary icons and routing components
import {FiMinus, FiPlus, FiShoppingBag, FiXCircle} from "react-icons/fi";
import {Link} from "react-router-dom";

// CartItem component displays a single product in the shopping cart
// It receives the item data and functions to manipulate cart quantities
export default function CartItem({
    item, // Product data with quantity information
    addItem, // Function to increase item quantity
    removeItem, // Function to decrease item quantity
    removeAllItems, // Function to remove all of this item from cart
    isAdding, // Loading state for adding items
    isRemoving, // Loading state for removing items
    isRemovingAll, // Loading state for removing all instances of an item
}) {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4">
                {/* Product image section */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {item.productId.productImages[0]?.url ? (
                        // Show product image if available
                        <img
                            src={item.productId.productImages[0].url}
                            alt={item.productId.name}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        // Show placeholder icon if no image is available
                        <FiShoppingBag className="text-gray-400 text-xl" />
                    )}
                </div>
                <div className="flex-1">
                    {/* Product information and remove button */}
                    <div className="flex justify-between items-start">
                        <div>
                            {/* Product name with link to product details */}
                            <h3 className="font-semibold hover:text-gray-800 transition-colors">
                                <Link to={`/product/${item.productId._id}`}>
                                    {item.productId.name}
                                </Link>
                            </h3>
                            {/* Product price */}
                            <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                        </div>
                        {/* Button to remove all units of this item */}
                        <button
                            onClick={() => removeAllItems(item.productId._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            disabled={isRemovingAll}
                        >
                            <FiXCircle className="text-xl" />
                        </button>
                    </div>
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 mt-3">
                        {/* Decrease quantity button */}
                        <button
                            onClick={() => removeItem(item.productId._id)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                            disabled={isRemoving || item.quantity === 1} // Disable if already at quantity 1
                        >
                            <FiMinus className="text-sm" />
                        </button>
                        {/* Current quantity display */}
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        {/* Increase quantity button */}
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
    );
}
