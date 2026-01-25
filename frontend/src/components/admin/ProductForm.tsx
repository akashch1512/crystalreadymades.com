import React, { useState, useEffect } from "react";
import { Product, Category, Brand } from "../../types";
import { getCategories, getBrands } from "../../data/mockData";

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    salePrice: product?.salePrice || 0,
    category: product?.category || "",
    brand: product?.brand || "",
    stock: product?.stock ?? true,
    quantity: product?.quantity || 0,
    images: product?.images || [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategoriesAndBrands = async () => {
      const [categoriesData, brandsData] = await Promise.all([
        getCategories(),
        getBrands(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
    };
    loadCategoriesAndBrands();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type , checked } = e.target;

    let parsedValue = value;
    if (type === "number") {
      parsedValue = value === "" ? 0 : parseFloat(value);
    } else if (type === "checkbox") {
      parsedValue = checked; // checkbox returns true/false
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length <= 1) return;

    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.salePrice > 0 && formData.salePrice >= formData.price) {
      newErrors.salePrice = "Sale price must be less than regular price";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.brand) {
      newErrors.brand = "Brand is required";
    }

    if (formData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }

    const hasEmptyImage = formData.images.some((img) => !img.trim());
    if (hasEmptyImage) {
      newErrors.images = "All image URLs must be provided";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      const slug = formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      const productData = {
        ...formData,
        slug,
      };

      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

      const response = await fetch(`${apiUrl}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create product");
      }

      onSubmit(result);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Product Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-2 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-md`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={`w-full p-2 border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } rounded-md`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.price ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="salePrice"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sale Price ($) <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="number"
            id="salePrice"
            name="salePrice"
            min="0"
            step="0.01"
            value={formData.salePrice || ""}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.salePrice ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors.salePrice && (
            <p className="mt-1 text-sm text-red-600">{errors.salePrice}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.category ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          >
            <option value="">Select Category</option>
            {categories.map((category: Category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Brand
          </label>
          <select
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.brand ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          >
            <option value="">Select Brand</option>
            {brands.map((brand: Brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quantity in Stock
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            className={`w-full p-2 border ${
              errors.quantity ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="stock"
            name="stock"
            checked={formData.stock}
            onChange={handleChange}
            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
          <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
            In Stock
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Images
        </label>
        {formData.images.map((image, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={image}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder="Image URL"
              className="flex-grow p-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={() => removeImageField(index)}
              disabled={formData.images.length <= 1}
              className="ml-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
            >
              Remove
            </button>
          </div>
        ))}
        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images}</p>
        )}
        <button
          type="button"
          onClick={addImageField}
          className="text-pink-600 hover:text-pink-800 text-sm font-medium"
        >
          + Add Another Image
        </button>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-300"
        >
          {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
