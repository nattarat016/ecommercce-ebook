import { useEffect, useState } from "react";
import { FeatureGrid } from "../components/home/FeatureGrid";
import { ProductGrid } from "../components/home/ProductGrid";
import { Product } from "../interfaces/product.interface";
import { productService } from "../services/product.service";
import { showToast } from "../utils/toast";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [recent, popular] = await Promise.all([
          productService.getAllProducts(),
          productService.getAllProducts(),
        ]);

        setRecentProducts(recent as Product[]);
        setPopularProducts(popular as Product[]);

        if (recent.length === 0 && popular.length === 0) {
          setError("ไม่พบรายการ eBook");
          showToast.error("ไม่พบรายการ eBook");
        }
      } catch (error: any) {
        console.error("Error loading products:", error);
        setError(error.message || "เกิดข้อผิดพลาดในการโหลด eBook");
        showToast.error(error.message || "เกิดข้อผิดพลาดในการโหลด eBook");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
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
            กรุณาเพิ่ม eBook ในระบบผ่านหน้า Admin
          </p>
        </div>
      ) : (
        
        <>
          {recentProducts.length > 0 && (
            <ProductGrid title="eBook มาใหม่" products={recentProducts} />
          )}
          {/* <Brands /> */}
          {popularProducts.length > 0 && (
            <ProductGrid title="eBook ยอดนิยม" products={popularProducts} />
          )}
          <div className="relative h-[700px]  rounded-2xl overflow-hidden mb-16">
        <img
          src="/img/bannn.webp"
          alt="ภาพพื้นหลัง"
          className="w-full h-full  object-cover"
        />
      </div>
        </>
      )}
    </div>
  );
};
