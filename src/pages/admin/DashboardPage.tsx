import { useEffect, useState } from "react";
import { orderService } from "../../services/order.service";
import { BiPackage, BiCube, BiMoney } from "react-icons/bi";
import { formatPrice } from "../../helpers";
import { Link } from "react-router-dom";
import { Order, OrderStatus } from "../../interfaces";
import { supabase } from "../../lib/supabase";

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Order[];
}

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // แยก query เป็นส่วนๆ
      const { data: ordersData, error: ordersError } = await supabase.from(
        "orders"
      ).select(`
          *,
          order_items (
            *,
            product:products (*)
          )
        `);

      if (ordersError) throw ordersError;

      // ดึงข้อมูล users แยก
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      // ดึงข้อมูล products แยก
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*");

      if (productsError) throw productsError;

      setStats({
        totalOrders: ordersData?.length || 0,
        totalProducts: productsData?.length || 0,
        totalUsers: profilesData?.length || 0,
        totalRevenue:
          ordersData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0,
        recentOrders: ordersData?.slice(0, 5) || [],
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      setLoading(true);
      await orderService.updateOrderStatus(orderId, newStatus);
      await loadDashboardData();
    } catch (error) {
      console.error("Error updating order status:", error);
      // TODO: Add toast notification for error
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error) return <div className="text-red-600 text-center p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">แดชบอร์ด</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <BiPackage className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                คำสั่งซื้อทั้งหมด
              </p>
              <p className="text-2xl font-semibold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <BiCube className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">สินค้าทั้งหมด</p>
              <p className="text-2xl font-semibold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <BiMoney className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">รายได้ทั้งหมด</p>
              <p className="text-2xl font-semibold">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-lg font-medium">คำสั่งซื้อล่าสุด</h2>
          <Link
            to="/admin/orders"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            ดูทั้งหมด
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  หมายเลขคำสั่งซื้อ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ลูกค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  วันที่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ยอดรวม
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.shipping_address.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }
                      ${
                        order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : ""
                      }
                      ${
                        order.status === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : ""
                      }
                      ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                      ${
                        order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : ""
                      }`}
                    >
                      {order.status === "pending" && "รอการยืนยัน"}
                      {order.status === "processing" && "กำลังดำเนินการ"}
                      {order.status === "shipped" && "จัดส่งแล้ว"}
                      {order.status === "delivered" && "ได้รับสินค้าแล้ว"}
                      {order.status === "cancelled" && "ยกเลิก"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      {order.status !== "processing" && (
                        <button
                          onClick={() =>
                            handleStatusChange(order.id, OrderStatus.PROCESSING)
                          }
                          className="px-2 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                        >
                          ดำเนินการ
                        </button>
                      )}
                      {order.status !== "shipped" &&
                        order.status !== "cancelled" && (
                          <button
                            onClick={() =>
                              handleStatusChange(order.id, OrderStatus.SHIPPED)
                            }
                            className="px-2 py-1 text-xs font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100"
                          >
                            จัดส่งแล้ว
                          </button>
                        )}
                      {order.status !== "delivered" &&
                        order.status !== "cancelled" && (
                          <button
                            onClick={() =>
                              handleStatusChange(
                                order.id,
                                OrderStatus.DELIVERED
                              )
                            }
                            className="px-2 py-1 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
                          >
                            ได้รับแล้ว
                          </button>
                        )}
                      {order.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            handleStatusChange(order.id, OrderStatus.CANCELLED)
                          }
                          className="px-2 py-1 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                        >
                          ยกเลิก
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
