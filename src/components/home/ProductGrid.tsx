import { Product } from "../../interfaces";
import { CardProduct } from "../products/CardProduct";

interface ProductGridProps {
  title: string;
  products: Product[];
}

export const ProductGrid = ({ title, products }: ProductGridProps) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {title}
          </h2>
          <div className="mt-4 mx-auto w-24 h-1 bg-indigo-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group transform hover:-translate-y-1 transition-all duration-300"
            >
              <CardProduct
                img={product.cover_url || "https://via.placeholder.com/400"}
                title={product.title}
                price={product.price}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
