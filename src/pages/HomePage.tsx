import { useEffect, useState } from "react";
import { Brands } from "../components/home/Brands";
import { FeatureGrid } from "../components/home/FeatureGrid";
import { ProductGrid } from "../components/home/ProductGrid";
import { Product } from "../interfaces";
import { productService } from "../services/product.service";

export const HomePage = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [recent, popular] = await Promise.all([
          productService.getRecentProducts(),
          productService.getPopularProducts(),
        ]);
        setRecentProducts(recent);
        setPopularProducts(popular);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <FeatureGrid />
      <ProductGrid title="สินค้ามาใหม่" products={recentProducts} />
      <Brands />
      <ProductGrid title="สินค้ายอดนิยม" products={popularProducts} />
    </div>
  );
};
