import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartService, CartItem } from "../services/cart.service";
import { authService } from "../services/auth.service";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        navigate("/signin");
        return;
      }
      const items = await cartService.getCartItems(user.id);
      setCartItems(items);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartId: string, quantity: number) => {
    try {
      await cartService.updateQuantity(cartId, quantity);
      await loadCartItems(); // โหลดข้อมูลใหม่
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveItem = async (cartId: string) => {
    try {
      await cartService.removeFromCart(cartId);
      await loadCartItems(); // โหลดข้อมูลใหม่
    } catch (err: any) {
      setError(err.message);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const variant = item.product.variants.find(
        (v: any) => v.id === item.variant_id
      );
      return total + (variant?.price || 0) * item.quantity;
    }, 0);
  };

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>เกิดข้อผิดพลาด: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        ตะกร้าสินค้า
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">ไม่มีสินค้าในตะกร้า</p>
          <button
            onClick={() => navigate("/celulares")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            เลือกซื้อสินค้า
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-200">
              {cartItems.map((item) => {
                const variant = item.product.variants.find(
                  (v: any) => v.id === item.variant_id
                );
                return (
                  <li key={item.id} className="py-6 flex">
                    <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                      <img
                        src={
                          item.product.images[0] ||
                          "https://via.placeholder.com/400"
                        }
                        alt={item.product.name}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>

                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.product.name}</h3>
                          <p className="ml-4">
                            ฿
                            {(
                              (variant?.price || 0) * item.quantity
                            ).toLocaleString()}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {variant?.storage} -{" "}
                          {
                            item.product.colors.find(
                              (c: any) => c.color === variant?.color
                            )?.color_name
                          }
                        </p>
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <div className="flex items-center">
                          <label
                            htmlFor={`quantity-${item.id}`}
                            className="mr-2"
                          >
                            จำนวน
                          </label>
                          <select
                            id={`quantity-${item.id}`}
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.id,
                                Number(e.target.value)
                              )
                            }
                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            {[1, 2, 3, 4, 5].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>ยอดรวม</p>
              <p>฿{calculateTotal().toLocaleString()}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              ค่าจัดส่งจะคำนวณในขั้นตอนการชำระเงิน
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/checkout")}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                ชำระเงิน
              </button>
            </div>
            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
              <p>
                หรือ{" "}
                <button
                  type="button"
                  onClick={() => navigate("/celulares")}
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  เลือกซื้อสินค้าต่อ<span aria-hidden="true"> &rarr;</span>
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
