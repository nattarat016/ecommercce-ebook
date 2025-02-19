import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/auth.service";
import { orderService } from "../services/order.service";
import { formatPrice } from "../helpers";
import { BiPackage } from "react-icons/bi";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        navigate("/signin");
        return;
      }
      setUser(currentUser);

      // ดึงคำสั่งซื้อล่าสุด 3 รายการ
      const orders = await orderService.getUserOrders(currentUser.id);
      setRecentOrders(orders.slice(0, 3));
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user?.email}</h1>
            <p className="text-gray-500 mt-1">
              สมาชิกตั้งแต่:{" "}
              {new Date(user?.created_at).toLocaleDateString("th-TH")}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      {/* <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">คำสั่งซื้อล่าสุด</h2>
          <Link
            to="/orders"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            ดูทั้งหมด
          </Link>
        </div> */}

        {recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="p-3 bg-indigo-50 rounded-full">
                  <BiPackage className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        คำสั่งซื้อ #{order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString("th-TH")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-emerald-600">
                        {formatPrice(order.total_price)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "shipped"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status === "delivered"
                          ? "ได้รับสินค้าแล้ว"
                          : order.status === "pending"
                          ? "รอดำเนินการ"
                          : order.status === "processing"
                          ? "กำลังดำเนินการ"
                          : order.status === "shipped"
                          ? "จัดส่งแล้ว"
                          : "ยกเลิก"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BiPackage className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-500 text-lg">ยังไม่มีคำสั่งซื้อ</h3>
            <Link
              to="/celulares"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium"
            >
              เริ่มช้อปปิ้งเลย
            </Link>
          </div>
        )}
      </div>
    // </div>
  );
}
