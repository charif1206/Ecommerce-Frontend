import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

export default function ProductForm({form, selectedCategory, onSubmit}) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* File Upload Field */}
                <FormField
                    control={form.control}
                    name="productImages"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700">
                                Product Images (up to 4) <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        field.onChange(files);
                                    }}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                    )}
                />

                {/* Common Fields */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium text-gray-700">
                                        Product Name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="brand"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium text-gray-700">
                                        Brand <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium text-gray-700">
                                        Price ($) <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="stock"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium text-gray-700">
                                        Stock <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="block text-sm font-medium text-gray-700">
                                    Description <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                        rows={3}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="block text-sm font-medium text-gray-700">
                                    Category <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Phones">Phones</SelectItem>
                                        <SelectItem value="Headphones">Headphones</SelectItem>
                                        <SelectItem value="Smartwatches">Smartwatches</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Dynamic Fields based on Category */}
                {selectedCategory && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            {selectedCategory} Specifications
                        </h3>
                        <div className="space-y-4">
                            {selectedCategory === "Phones" && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="variants.ram"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium text-gray-700">
                                                    RAM
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black">
                                                        <SelectValue placeholder="Select RAM" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="4GB">4GB</SelectItem>
                                                        <SelectItem value="6GB">6GB</SelectItem>
                                                        <SelectItem value="8GB">8GB</SelectItem>
                                                        <SelectItem value="12GB">12GB</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-red-500 text-sm" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="variants.storage"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium text-gray-700">
                                                    Storage
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black">
                                                        <SelectValue placeholder="Select Storage" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="64GB">64GB</SelectItem>
                                                        <SelectItem value="128GB">128GB</SelectItem>
                                                        <SelectItem value="256GB">256GB</SelectItem>
                                                        <SelectItem value="512GB">512GB</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-red-500 text-sm" />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {selectedCategory === "Headphones" && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="variants.batteryLife"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium text-gray-700">
                                                    Battery Life
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g., 18h"
                                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-sm" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="variants.noiseCancellation"
                                        render={({field}) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-white">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-sm font-medium text-gray-700">
                                                        Noise Cancellation
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="data-[state=checked]:bg-black"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-sm" />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {selectedCategory === "Smartwatches" && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="variants.screenType"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="block text-sm font-medium text-gray-700">
                                                    Screen Type
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-black">
                                                        <SelectValue placeholder="Select Screen Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="AMOLED">
                                                            AMOLED
                                                        </SelectItem>
                                                        <SelectItem value="LCD">LCD</SelectItem>
                                                        <SelectItem value="LED">LED</SelectItem>
                                                        <SelectItem value="Retina">
                                                            Retina
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-red-500 text-sm" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="variants.waterResistant"
                                        render={({field}) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-white">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-sm font-medium text-gray-700">
                                                        Water Resistant
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="data-[state=checked]:bg-black"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-sm" />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-900 text-white rounded-lg px-4 py-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                    Create Product
                </Button>
            </form>
        </Form>
    );
}
