export default function ImageGallery({images, selectedImage, setSelectedImage}) {
    

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden">
                <img
                    src={images[selectedImage].url}
                    alt="Product"
                    className="w-full h-full object-contain"
                />
            </div>
            {/* Thumbnail Images */}
            <div className="flex gap-4">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 rounded-lg overflow-hidden ${
                            selectedImage === index ? "ring-2 ring-black" : ""
                        }`}
                    >
                        <img
                            src={image.url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
