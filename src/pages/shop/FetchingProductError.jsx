import React from "react";

const FetchingProductError = ({error}) => {
    return (
        <div className="flex-1 text-center py-10 space-y-4">
            <div className="text-red-500 text-xl font-semibold">Oops! Something went wrong.</div>
            <p className="text-gray-600">
                {error.message || "An error occurred while fetching products."}
            </p>
        </div>
    );
};

export default FetchingProductError;
