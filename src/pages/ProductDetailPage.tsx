import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { cartService } from "../services/cart.service";
import { authService } from "../services/auth.service";
import { Product } from "../interfaces";
import { BiShoppingBag, BiCheck } from "react-icons/bi";
import { showToast } from "../utils/toast";

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError("ไม่พบรหัสสินค้า");
      setLoading(false);
      return;
    }
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      console.log("Loading product:", slug);
      const { data, error } = await supabase
        .from("Ebooks")
        .select(
          `
          *
        `
        )
        .eq("title", slug)
        .single();

      if (error) {
        console.error("Error loading product:", error);
        throw error;
      }

      if (!data) {
        throw new Error("ไม่พบสินค้า");
      }

      setProduct(data);
    } catch (err: any) {
      console.error("Error in loadProduct:", err);
      setError(err.message);
      showToast.error(err.message || "ไม่พบสินค้า");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const user = await authService.getCurrentUser();
      console.log("User:", user);
      if (!user) {
        showToast.error("กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าลงตะกร้า");
        navigate("/signin", { state: { from: location.pathname } });
        return;
      }

      setIsAddingToCart(true);
      await showToast.promise(
        cartService.addToCart(
          user.id,
          product!.id,
        ),
        {
          loading: "กำลังเพิ่มสินค้าลงตะกร้า...",
          success: "เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว",
          error: "เกิดข้อผิดพลาดในการเพิ่มสินค้า",
        }
      );

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      showToast.error(err.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้าลงตะกร้า");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
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
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            กลับไปหน้าสินค้า
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* รูปภาพสินค้า */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              <img
                src={product.cover_url || "https://via.placeholder.com/400"}
                alt={product.title}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>

          {/* ข้อมูลสินค้า */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.title}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">รายละเอียดสินค้า</h2>
              <div className="text-base text-gray-700 space-y-6">
                {typeof product.description === "string"
                  ? product.description
                  : product.description?.content?.[0]?.content?.[0]?.text ||
                    "ไม่มีคำอธิบายสินค้าครับ"}
              </div>
            </div>

            {/* ปุ่มเพิ่มลงตะกร้า */}
            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={
                  isAddingToCart
                }
                className="w-full bg-emerald-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed relative"
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
                  </>
                )}
              </button>

            </div>
            </div>
          </div>
        </div>
      </div>
  );
};
