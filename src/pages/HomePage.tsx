import { useEffect, useState } from "react";
import { Brands } from "../components/home/Brands";
import { FeatureGrid } from "../components/home/FeatureGrid";
import { ProductGrid } from "../components/home/ProductGrid";
import { Product } from "../interfaces/product.interface";
import { productService } from "../services/product.service";
import { showToast } from "../utils/toast";

export const HomePage = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log("Fetching products...");
        const [recent, popular] = await Promise.all([
          productService.getRecentProducts(),
          productService.getPopularProducts(),
        ]);
        console.log("Recent products:", recent);
        console.log("Popular products:", popular);

        setRecentProducts(recent as Product[]);
        setPopularProducts(popular as Product[]);

        if (recent.length === 0 && popular.length === 0) {
          setError("ไม่พบรายการสินค้า");
          showToast.error("ไม่พบรายการสินค้า");
        }
      } catch (error: any) {
        console.error("Error loading products:", error);
        setError(error.message || "เกิดข้อผิดพลาดในการโหลดสินค้า");
        showToast.error(error.message || "เกิดข้อผิดพลาดในการโหลดสินค้า");
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
      {error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <p className="text-gray-600 mt-2">
            กรุณาเพิ่มสินค้าในระบบผ่านหน้า Admin
          </p>
        </div>
      ) : (
        <>
          {recentProducts.length > 0 && (
            <ProductGrid title="สินค้ามาใหม่" products={recentProducts} />
          )}
          <Brands />
          {popularProducts.length > 0 && (
            <ProductGrid title="สินค้ายอดนิยม" products={popularProducts} />
          )}
        </>
      )}
    </div>
  );
};
