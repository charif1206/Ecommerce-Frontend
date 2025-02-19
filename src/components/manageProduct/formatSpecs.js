export const formatSpecs = (product) => {
    if (!product || !product.variants) return "N/A";

    const {variants, category} = product;

    switch (category) {
        case "Phones":
            return `RAM: ${variants.ram || "N/A"}, Storage: ${variants.storage || "N/A"}`;
        case "Headphones":
            return `Battery Life: ${variants.batteryLife || "N/A"}, Noise Cancellation: ${
                variants.noiseCancellation ? "Yes" : "No"
            }`;
        case "Smartwatches":
            return `Screen: ${variants.screenType || "N/A"}, Water Resistant: ${
                variants.waterResistant ? "Yes" : "No"
            }`;
        default:
            return "N/A";
    }
};
