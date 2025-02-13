import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/product.service";
import { cartService } from "../services/cart.service";
import { authService } from "../services/auth.service";
import { Product } from "../interfaces/product.interface";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      if (!slug) return;
      const data = await productService.getProductBySlug(slug);
      setProduct(data);
      if (data?.variants?.[0]?.id) {
        setSelectedVariant(data.variants[0].id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        navigate("/signin");
        return;
      }

      if (!product || !selectedVariant) return;

      await cartService.addToCart(
        user.id,
        product.id,
        selectedVariant,
        quantity
      );
      // แสดง toast หรือ notification ว่าเพิ่มสินค้าลงตะกร้าสำเร็จ
      alert("เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;
  if (!product) return <div>ไม่พบสินค้า</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* รูปภาพสินค้า */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
            <img
              src={product.images[0] || "https://via.placeholder.com/400"}
              alt={product.name}
              className="w-full h-full object-center object-cover"
            />
          </div>
        </div>

        {/* ข้อมูลสินค้า */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {product.name}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">รายละเอียดสินค้า</h2>
            <div className="text-base text-gray-700 space-y-6">
              {product.description?.content?.[0]?.content?.[0]?.text ||
                "ไม่มีคำอธิบายสินค้า"}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm text-gray-600">สี</h3>
            <div className="mt-1 flex space-x-2">
              {product.colors.map((color: any) => (
                <div
                  key={color.color}
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color.color }}
                  title={color.color_name}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm text-gray-600">รุ่น</h3>
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {product.variants.map((variant: any) => (
                <option key={variant.id} value={variant.id}>
                  {variant.storage} - ฿{variant.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <h3 className="text-sm text-gray-600">จำนวน</h3>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-10 flex">
            <button
              onClick={handleAddToCart}
              className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
            >
              เพิ่มลงตะกร้า
            </button>
          </div>

          {/* คุณสมบัติเด่น */}
          <div className="mt-10">
            <h3 className="text-sm font-medium text-gray-900">คุณสมบัติเด่น</h3>
            <div className="mt-4">
              <ul className="pl-4 list-disc text-sm space-y-2">
                {product.features.map((feature: string) => (
                  <li key={feature} className="text-gray-600">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
