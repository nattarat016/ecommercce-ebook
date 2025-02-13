import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cartService, CartItem } from "../services/cart.service";
import { authService } from "../services/auth.service";
import { formatPrice } from "../helpers";
import {
  BiTrash,
  BiMinus,
  BiPlus,
  BiArrowBack,
  BiInfoCircle,
} from "react-icons/bi";
import { showToast } from "../utils/toast";

export const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        navigate("/signin", { state: { from: location.pathname } });
        return;
      }
      const items = await cartService.getCartItems(user.id);
      setCartItems(items);
    } catch (err: any) {
      showToast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) return;
      await cartService.updateCartItemQuantity(itemId, newQuantity);
      await loadCartItems();
    } catch (err: any) {
      showToast.error(err.message);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await cartService.removeFromCart(itemId);
      await loadCartItems();
    } catch (err: any) {
      showToast.error(err.message);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.variant?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ตะกร้าสินค้า</h1>
            <p className="text-sm text-gray-500 mt-1">
              {cartItems.length} รายการในตะกร้า
            </p>
          </div>
          <Link
            to="/celulares"
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <BiArrowBack className="mr-2" />
            เลือกซื้อสินค้าต่อ
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">ไม่มีสินค้าในตะกร้า</div>
            <Link
              to="/celulares"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              เลือกซื้อสินค้า
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-24 h-24">
                          <img
                            src={
                              item.product?.images?.[0] ||
                              "https://via.placeholder.com/150"
                            }
                            alt={item.product?.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="ml-6 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {item.product?.name}
                              </h3>
                              <div className="mt-1 space-y-1">
                                <p className="text-sm text-gray-500">
                                  สี: {item.variant?.color_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ความจุ: {item.variant?.storage}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ราคาต่อชิ้น:{" "}
                                  {formatPrice(item.variant?.price || 0)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center border rounded-lg">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="p-2 hover:bg-gray-100"
                                  disabled={item.quantity <= 1}
                                >
                                  <BiMinus
                                    className={
                                      item.quantity <= 1
                                        ? "text-gray-300"
                                        : "text-gray-600"
                                    }
                                  />
                                </button>
                                <span className="px-4 py-2 text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="p-2 hover:bg-gray-100"
                                >
                                  <BiPlus className="text-gray-600" />
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <BiTrash className="w-5 h-5" />
                              </button>
                            </div>
                            <p className="text-lg font-medium text-gray-900">
                              {formatPrice(
                                (item.variant?.price || 0) * item.quantity
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white shadow-sm rounded-lg p-6 space-y-6 sticky top-20">
                <h2 className="text-lg font-medium text-gray-900">
                  สรุปคำสั่งซื้อ
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">จำนวนสินค้า</p>
                    <p className="text-gray-900">{cartItems.length} รายการ</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">ยอดรวมสินค้า</p>
                    <p className="text-gray-900">
                      {formatPrice(calculateTotal())}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">ค่าจัดส่ง</p>
                    <p className="text-gray-900">คำนวณในขั้นตอนถัดไป</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <p className="text-base font-medium text-gray-900">
                        ยอดรวมทั้งหมด
                      </p>
                      <p className="text-base font-medium text-gray-900">
                        {formatPrice(calculateTotal())}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/checkout"
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    ดำเนินการชำระเงิน
                  </Link>

                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <BiInfoCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500">
                          สินค้าในตะกร้าไม่ใช่การจองสินค้า
                          โปรดชำระเงินเพื่อยืนยันคำสั่งซื้อ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
