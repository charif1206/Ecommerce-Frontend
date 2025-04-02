
const productLoading = () => {
    return (
        <div className="flex-1 text-center py-10 space-y-4">
            <div className="text-blue-500 text-xl font-semibold">Loading products...</div>
            <div className="text-gray-600">Please wait while we fetch the latest products.</div>
            <div className="mt-4">
                <svg
                    className="w-8 h-8 mx-auto animate-spin text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 12a8 8 0 0116 0"
                        className="opacity-75"
                    />
                </svg>
            </div>
        </div>
    );
};

export default productLoading;
