export default function ProductDetails({product}) {
    return (
        <div className="space-y-6">
            <div className="max-w-xs mx-auto w-full">
                {" "}
                {/* Centered container */}
                <h3 className="text-lg font-semibold mb-4 text-center">Product Specifications</h3>
                <div className="space-y-3">
                    {/* Brand Information */}
                    <div className="flex justify-between items-center py-2 border-b px-4">
                        <span className="text-gray-600">Brand</span>
                        <span className="font-medium">{product.brand}</span>
                    </div>

                    {/* Dynamic Variants */}
                    {product.variants &&
                        Object.entries(product.variants).map(([key, value]) => {
                            const formattedKey = key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase());

                            const formattedValue =
                                typeof value === "boolean"
                                    ? value
                                        ? "Yes"
                                        : "No"
                                    : value.toString();

                            return (
                                <div
                                    key={key}
                                    className="flex justify-between items-center py-2 border-b px-4"
                                >
                                    <span className="text-gray-600">{formattedKey}</span>
                                    <span className="font-medium capitalize">{formattedValue}</span>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
