import {FiMinus, FiPlus, FiShoppingBag, FiXCircle} from "react-icons/fi";
import {Link} from "react-router-dom";

export default function CartItem({
    item,
    addItem,
    removeItem,
    removeAllItems,
    isAdding,
    isRemoving,
    isRemovingAll,
}) {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4">
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
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold hover:text-gray-800 transition-colors">
                                <Link to={`/product/${item.productId._id}`}>
                                    {item.productId.name}
                                </Link>
                            </h3>
                            <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={() => removeAllItems(item.productId._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            disabled={isRemovingAll}
                        >
                            <FiXCircle className="text-xl" />
                        </button>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                        <button
                            onClick={() => removeItem(item.productId._id)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                            disabled={isRemoving || item.quantity === 1}
                        >
                            <FiMinus className="text-sm" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
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
