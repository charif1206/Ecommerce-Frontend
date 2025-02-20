import {z} from "zod";

// Base schema: Requires description (min 10 chars) and trims input.
const baseSchema = z.object({
    name: z.string().min(5, "Product name should have at least 5 characters"),
    brand: z.string().min(3, "Brand should have at least 3 characters"),
    description: z.string().min(10, "Description should have at least 10 characters").trim(),
    price: z.number().min(0, "Price must be a positive number"),
    stock: z.number().min(0, "Stock must be a non-negative number"),
    productImages: z
        .array(z.instanceof(File))
        .max(4, "You can only upload up to 4 images")
        .min(1, "At least one image is required"),
});

// Schema for Phones: Both RAM and Storage are required.
const phoneSchema = baseSchema.extend({
    category: z.literal("Phones"),
    variants: z.object({
        ram: z.string().min(1, "RAM is required"),
        storage: z.string().min(1, "Storage is required"),
    }),
});

// Schema for Headphones: Battery life must end with 'h', and noiseCancellation is a boolean.
const headphonesSchema = baseSchema.extend({
    category: z.literal("Headphones"),
    variants: z.object({
        batteryLife: z.string().regex(/^\d+h$/, "Battery life must end with 'h' (e.g. 18h)"),
        noiseCancellation: z.boolean().default(false),
    }),
});

// Schema for Smartwatches: Both Screen Type and Water Resistant are required.
const smartwatchesSchema = baseSchema.extend({
    category: z.literal("Smartwatches"),
    variants: z.object({
        screenType: z.string().min(1, "Screen type is required"),
        waterResistant: z.boolean().default(false),
    }),
});

// Discriminated union based on the "category" field.
export const formSchema = z.discriminatedUnion("category", [
    phoneSchema,
    headphonesSchema,
    smartwatchesSchema,
]);

// Export schemas individually if needed
export {phoneSchema, headphonesSchema, smartwatchesSchema, baseSchema};
