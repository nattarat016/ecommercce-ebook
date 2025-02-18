import { useEffect, useState } from "react";
import { CardProduct } from "../components/products/CardProduct";
import { ContainerFilter } from "../components/products/ContainerFilter";
import { Product } from "../interfaces";
import { productService } from "../services/product.service";

export const CellPhonesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let data: Product[];
        if (selectedBrand) {
          data = await productService.filterProductsByBrand(selectedBrand);
        } else {
          data = await productService.getAllProducts();
        }
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedBrand]);

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <>
      <h1 className="text-5xl font-semibold text-center mb-12">
        โทรศัพท์มือถือ
      </h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* ตัวกรอง */}
        <ContainerFilter
          onBrandSelect={handleBrandSelect}
          selectedBrand={selectedBrand}
        />

        <div className="col-span-2 lg:col-span-2 xl:col-span-4 flex flex-col gap-12">
          <div className="grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4">
            {products.map((product) => (
              <CardProduct
                key={product.id}
                title={product.title}
                price={product.price}
                img={product.cover_url || ""}
              />
            ))}
          </div>

        </div>
      </div>
    </>
  );
};
