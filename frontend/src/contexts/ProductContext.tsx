import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { Product, FilterOptions, Category, Brand } from "../types";

interface ProductContextValue {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  filteredProducts: Product[];
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  clearFilters: () => void;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextValue>({
  products: [],
  categories: [],
  brands: [],
  filteredProducts: [],
  filterOptions: {},
  setFilterOptions: () => {
    throw new Error("setFilterOptions must be used within ProductProvider");
  },
  getProductById: () => undefined,
  getProductBySlug: () => undefined,
  searchProducts: () => [],
  clearFilters: () => {},
  deleteProduct: async () => {},
});

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  const fetchWithRetry = async (url: string, options = {}, retries = 3) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  };

  const API_BASE = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const fetchData = async () => {
      try {

        const [productRes, categoryRes, brandRes] = await Promise.all([
          fetchWithRetry(`${API_BASE}/api/products`),
          fetchWithRetry(`${API_BASE}/api/products/categories`),
          fetchWithRetry(`${API_BASE}/api/products/brands`)
        ]);


        const [productData, categoryData, brandData] = await Promise.all([
          productRes.json(),
          categoryRes.json(),
          brandRes.json()
        ]);

        setProducts(productData.map((p: any) => ({ ...p, id: p.id || p._id })));
        setCategories(categoryData.map((c: any) => ({ ...c, id: String(c.id) })));
        setBrands(brandData.map((b: any) => ({ ...b, id: String(b.id) })));
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filterOptions.category) {
      result = result.filter(p => p.category === filterOptions.category);
    }

    if (filterOptions.brand) {
      result = result.filter(p => p.brand === filterOptions.brand);
    }

    if (filterOptions.minPrice !== undefined) {
      result = result.filter(p => {
        const price = p.salePrice || p.price;
        return price >= filterOptions.minPrice!;
      });
    }

    if (filterOptions.maxPrice !== undefined) {
      result = result.filter(p => {
        const price = p.salePrice || p.price;
        return price <= filterOptions.maxPrice!;
      });
    }

    if (filterOptions.rating !== undefined) {
      result = result.filter(p => p.ratings >= filterOptions.rating!);
    }

    if (filterOptions.tags?.length) {
      result = result.filter(p =>
        filterOptions.tags!.some(tag => p.tags.includes(tag))
      );
    }

    if (filterOptions.sortBy) {
      switch (filterOptions.sortBy) {
        case "price-asc":
          result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
          break;
        case "price-desc":
          result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
          break;
        case "newest":
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case "popular":
          result.sort((a, b) => b.ratings - a.ratings);
          break;
      }
    }

    return result;
  }, [filterOptions, products]);

  const getProductById = (id: string) => 
    products.find(p => p.id === id || p._id === id);

  const getProductBySlug = (slug: string) => 
    products.find(p => p.slug === slug);

  const searchProducts = (query: string) => {
    if (!query.trim()) return [];
    const terms = query.toLowerCase().split(" ");
    return products.filter(p => {
      const text = `
        ${p.name}
        ${p.description}
        ${p.category}
        ${p.brand}
        ${p.tags.join(" ")}
      `.toLowerCase();
      return terms.some(term => text.includes(term));
    });
  };

  const clearFilters = () => setFilterOptions({});

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetchWithRetry(`${API_BASE}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        brands,
        filteredProducts,
        filterOptions,
        setFilterOptions,
        getProductById,
        getProductBySlug,
        searchProducts,
        clearFilters,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};