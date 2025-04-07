export default function CartLoading() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-lg p-6 shadow-sm h-32 bg-gray-100"
                            ></div>
                        ))}
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm h-fit space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
