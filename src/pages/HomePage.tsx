import { useEffect, useState } from "react";
import { Brands } from "../components/home/Brands";
import { FeatureGrid } from "../components/home/FeatureGrid";
import { ProductGrid } from "../components/home/ProductGrid";
import { Product } from "../interfaces";
import { productService } from "../services/product.service";

const prepareProductsForGrid = (products: Product[]) => {
  return products.map((product) => ({
    ...product,
    colors: product.colors.map((color) => ({
      name: color.color_name,
      color: color.color,
    })),
  }));
};

export const HomePage = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [recent, popular] = await Promise.all([
          productService.getRecentProducts(),
          productService.getPopularProducts(),
        ]);

        setRecentProducts(recent);
        setPopularProducts(popular);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div>
      <FeatureGrid />

      <ProductGrid
        title="สินค้าใหม่"
        products={prepareProductsForGrid(recentProducts)}
      />

      <ProductGrid
        title="สินค้าแนะนำ"
        products={prepareProductsForGrid(popularProducts)}
      />

      <Brands />
    </div>
  );
};
