export default function CartError() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 text-center">
            <div className="container mx-auto px-4">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                    Failed to load cart. Please try refreshing the page.
                </div>
            </div>
        </div>
    );
}
