import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/product.service";
import { cartService } from "../services/cart.service";
import { authService } from "../services/auth.service";
import { Product } from "../interfaces";
import { formatPrice } from "../helpers";
import { BiShoppingBag, BiCheck } from "react-icons/bi";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      if (!slug) return;
      const data = await productService.getProductBySlug(slug);
      if (!data) {
        setError("Product not found");
        return;
      }
      setProduct(data);

      // หาสีและความจุแรกที่มีของในสต็อก
      if (data.variants && data.variants.length > 0) {
        const firstAvailableVariant = data.variants.find((v) => v.stock > 0);
        if (firstAvailableVariant) {
          setSelectedColor(firstAvailableVariant.color);
          setSelectedStorage(firstAvailableVariant.storage || "");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // รวบรวมสีที่ไม่ซ้ำกัน
  const availableColors =
    product?.variants?.reduce(
      (colors: { color: string; color_name: string }[], variant) => {
        if (!colors.some((c) => c.color === variant.color)) {
          colors.push({ color: variant.color, color_name: variant.color_name });
        }
        return colors;
      },
      []
    ) || [];

  // รวบรวมความจุที่มีสำหรับสีที่เลือก
  const availableStorages = Array.from(
    new Set(
      product?.variants
        ?.filter((v) => v.color === selectedColor)
        .map((v) => v.storage)
        .filter(Boolean)
        .sort((a, b) => {
          // เรียงลำดับตามตัวเลขในสตริง (เช่น "128GB" > "64GB")
          const numA = parseInt(a?.replace(/\D/g, "") || "0");
          const numB = parseInt(b?.replace(/\D/g, "") || "0");
          return numA - numB;
        }) || []
    )
  );

  // หาตัวเลือกที่เลือกตามสีและความจุ
  const selectedVariant = product?.variants?.find(
    (v) => v.color === selectedColor && v.storage === selectedStorage
  );

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // รีเซ็ตความจุเมื่อเปลี่ยนสี
    const firstStorageForColor = product?.variants?.find(
      (v) => v.color === color
    )?.storage;
    setSelectedStorage(firstStorageForColor || null);
    setQuantity(1);
  };

  const handleStorageSelect = (storage: string) => {
    setSelectedStorage(storage);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        navigate("/signin");
        return;
      }

      if (!selectedVariant) {
        alert("กรุณาเลือกสีและความจุสินค้า");
        return;
      }

      if (!selectedColor || !selectedStorage) {
        alert("กรุณาเลือกสีและความจุสินค้า");
        return;
      }

      setIsAddingToCart(true);
      await cartService.addToCart(
        user.id,
        product!.id,
        selectedVariant.id,
        quantity
      );

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      alert(err.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {error || "ไม่พบสินค้า"}
          </h2>
          <button
            onClick={() => navigate("/celulares")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            กลับไปหน้าสินค้า
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* รูปภาพสินค้า */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/400"}
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
              {typeof product.description === "string"
                ? product.description
                : product.description?.content?.[0]?.content?.[0]?.text ||
                  "ไม่มีคำอธิบายสินค้า"}
            </div>
          </div>

          {/* ส่วนเลือกสี */}
          <div className="mt-6">
            <h3 className="text-sm text-gray-600">สี</h3>
            <div className="mt-2">
              <div className="flex items-center space-x-3">
                {availableColors.map(({ color, color_name }) => {
                  const variantsForColor =
                    product.variants?.filter((v) => v.color === color) || [];
                  const isOutOfStock = variantsForColor.every(
                    (v) => v.stock === 0
                  );

                  return (
                    <button
                      key={color}
                      onClick={() => !isOutOfStock && handleColorSelect(color)}
                      disabled={isOutOfStock}
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-black"
                          : ""
                      } ${
                        isOutOfStock
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-gray-300"
                      }`}
                      title={`${color_name}${
                        isOutOfStock ? " (สินค้าหมด)" : ""
                      }`}
                    >
                      <span
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {isOutOfStock && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="block w-full h-[1px] bg-red-500 transform rotate-45" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedColor && (
                <p className="mt-2 text-sm text-gray-500">
                  {
                    product.variants?.find((v) => v.color === selectedColor)
                      ?.color_name
                  }
                </p>
              )}
            </div>
          </div>

          {/* ส่วนเลือกความจุ */}
          {selectedColor && availableStorages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm text-gray-600">ความจุ</h3>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {availableStorages.map((storage) => {
                  const variant = product?.variants?.find(
                    (v) => v.color === selectedColor && v.storage === storage
                  );
                  const isOutOfStock = variant?.stock === 0;

                  return (
                    <button
                      key={storage}
                      onClick={() =>
                        !isOutOfStock && handleStorageSelect(storage)
                      }
                      disabled={isOutOfStock}
                      className={`px-4 py-2 border rounded-md text-sm font-medium ${
                        selectedStorage === storage
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-300 text-gray-700"
                      } ${
                        isOutOfStock
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {storage}
                      {variant && (
                        <div className="text-xs mt-1">
                          {formatPrice(variant.price)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* แสดงสต็อกและราคา */}
          {selectedVariant && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                เหลือ {selectedVariant.stock} ชิ้น
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-2">
                {formatPrice(selectedVariant.price)}
              </p>
            </div>
          )}

          {/* ส่วนเลือกจำนวน */}
          <div className="mt-6">
            <h3 className="text-sm text-gray-600">จำนวน</h3>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {[
                ...Array(
                  selectedVariant ? Math.min(selectedVariant.stock, 5) : 0
                ),
              ].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* ปุ่มเพิ่มลงตะกร้า */}
          <div className="mt-8">
            <button
              onClick={handleAddToCart}
              disabled={
                !selectedVariant ||
                selectedVariant.stock === 0 ||
                isAddingToCart
              }
              className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed relative"
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : showSuccess ? (
                <>
                  <BiCheck className="w-5 h-5 mr-2" />
                  เพิ่มลงตะกร้าแล้ว
                </>
              ) : (
                <>
                  <BiShoppingBag className="w-5 h-5 mr-2" />
                  {!selectedColor
                    ? "กรุณาเลือกสี"
                    : !selectedStorage
                    ? "กรุณาเลือกความจุ"
                    : selectedVariant?.stock === 0
                    ? "สินค้าหมด"
                    : "เพิ่มลงตะกร้า"}
                </>
              )}
            </button>

            {/* แสดงราคารวม */}
            {selectedVariant && quantity > 0 && (
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-500">
                  ราคารวม: {formatPrice(selectedVariant.price * quantity)}
                </p>
              </div>
            )}
          </div>

          {/* คุณสมบัติเด่น */}
          <div className="mt-10">
            <h3 className="text-sm font-medium text-gray-900">คุณสมบัติเด่น</h3>
            <div className="mt-4">
              <ul className="pl-4 list-disc text-sm space-y-2">
                {(product.features || []).map((feature: string) => (
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
