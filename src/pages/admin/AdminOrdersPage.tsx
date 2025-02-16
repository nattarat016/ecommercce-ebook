import { useCallback, useState, useEffect } from "react";
import { Order, OrderStatus } from "../../types/models";
import { useAsync } from "../../hooks/useAsync";
import { SelectOption } from "../../types/common";
import { getStatusColor, getStatusText } from "../../utils/orderStatus";
import { BiSearch, BiFilterAlt, BiTrash } from "react-icons/bi";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";

// Constants
const statusOptions: SelectOption[] = Object.values(OrderStatus).map(
  (status) => ({
    value: status,
    label: getStatusText(status),
  })
);

const ITEMS_PER_PAGE = 10;

export const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Check if Supabase is initialized
        if (!supabase) {
          console.error("Supabase client not initialized");
          showToast.error("ไม่สามารถเชื่อมต่อกับระบบได้");
          navigate("/");
          return;
        }

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) {
          console.error("Auth error:", authError);
          showToast.error("กรุณาเข้าสู่ระบบก่อน");
          navigate("/signin");
          return;
        }

        if (!user) {
          showToast.error("กรุณาเข้าสู่ระบบก่อน");
          navigate("/signin");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          showToast.error("ไม่พบข้อมูลผู้ใช้");
          navigate("/");
          return;
        }

        if (!profile?.is_admin) {
          showToast.error("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
          navigate("/");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        showToast.error("เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์");
        navigate("/");
      }
    };

    checkAdmin();
  }, [navigate]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: orders = [],
    loading,
    error,
    execute: loadOrders,
  } = useAsync<Order[]>(async () => {
    if (!isAdmin) return [];

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            *,
            product:products (
              id,
              title,
              brand
            ),
            variant:product_variants (
              id,
              color,
              color_name
            )
          )
        `
        )
        .order("created_at", { ascending: false });

      showToast.success("กำลังโหลดข้อมูลคำสั่งซื้อ...");

      if (error) {
        showToast.error("ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้");
        throw error;
      }

      if (data && data.length === 0) {
        showToast.success("ไม่พบข้อมูลคำสั่งซื้อ");
      } else {
      }

      const transformedOrders = data?.map((order) => ({
        id: order.id,
        user_id: order.user_id,
        customer_name: order.customer_name,
        shipping_address: {
          email: order.shipping_address?.email || "",
          full_name: order.shipping_address?.full_name || "",
          phone: order.shipping_address?.phone || "",
          address: order.shipping_address?.address || "",
        },
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        total: order.total,
        status: order.status,
        created_at: order.created_at,
        order_items:
          order.order_items?.map((item: any) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            product: {
              id: item.product?.id || "",
              name: item.product?.name || "",
              brand: item.product?.brand || "",
            },
            variant: {
              id: item.variant?.id || "",
              color: item.variant?.color || "",
              color_name: item.variant?.color_name || "",
            },
          })) || [],
      }));

      return transformedOrders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("ไม่สามารถดึงข้อมูลคำสั่งซื้อได้");
    }
  });

  // Load orders when admin status changes
  useEffect(() => {
    if (isAdmin) {
      loadOrders();
    }
  }, [isAdmin]);

  // Callbacks
  const handleDeleteOrder = useCallback(
    async (orderId: string) => {
      if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบคำสั่งซื้อนี้?")) return;

      const deletePromise = (async () => {
        try {
          // ลบ order_items ก่อน (ถ้าไม่ได้ตั้ง cascade delete)
          await supabase.from("order_items").delete().eq("order_id", orderId);

          // ลบ order
          const { error } = await supabase
            .from("orders")
            .delete()
            .eq("id", orderId);

          if (error) throw error;
          await loadOrders();
          return "ลบคำสั่งซื้อเรียบร้อยแล้ว";
        } catch (error) {
          console.error("Error deleting order:", error);
          throw new Error("เกิดข้อผิดพลาดในการลบคำสั่งซื้อ");
        }
      })();

      showToast.promise(deletePromise, {
        loading: "กำลังลบคำสั่งซื้อ...",
        success: "ลบคำสั่งซื้อเรียบร้อยแล้ว",
        error: "เกิดข้อผิดพลาดในการลบคำสั่งซื้อ",
      });
    },
    [loadOrders]
  );

  const handleCopyOrderId = async (orderId: string) => {
    try {
      await navigator.clipboard.writeText(orderId);
      showToast.success("คัดลอกรหัสคำสั่งซื้อแล้ว");
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast.error("ไม่สามารถคัดลอกรหัสคำสั่งซื้อได้");
    }
  };

  // Filtering and pagination
  const filteredOrders = (orders ?? []).filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // แสดงข้อมูลในตาราง
  const renderOrderItems = (items: any[]) => {
    return items.map((item) => (
      <div key={item.id} className="text-sm">
        {item.product.name} - {item.variant.color_name}
        <span className="text-gray-500"> x{item.quantity}</span>
      </div>
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">จัดการคำสั่งซื้อ</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                เกิดข้อผิดพลาด
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {typeof error === "object" && error
                  ? (error as Error).message
                  : String(error)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">จัดการคำสั่งซื้อ</h1>
          <p className="text-gray-600 mt-1">
            ทั้งหมด {filteredOrders.length} รายการ
          </p>
        </div>
        <div className="flex gap-4">
          {/* Search */}
          <div className="relative">
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาตามรหัส, ชื่อ หรืออีเมล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          {/* Status Filter */}
          <div className="relative">
            <BiFilterAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as OrderStatus | "all")
              }
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">ทุกสถานะ</option>
              {statusOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  รหัสคำสั่งซื้อ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ลูกค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  รายการสินค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ยอดรวม
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    ไม่พบข้อมูลคำสั่งซื้อ
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <button
                        id={`order-${order.id}`}
                        onClick={() => handleCopyOrderId(order.id)}
                        className="hover:text-indigo-600 transition-colors duration-200 cursor-pointer flex items-center gap-1"
                      >
                        {order.id}
                        <svg
                          className="w-4 h-4 opacity-50 hover:opacity-100"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shipping_address.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {renderOrderItems(order.order_items)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ฿{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm rounded-full px-3 py-1 font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <BiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            แสดง {(currentPage - 1) * ITEMS_PER_PAGE + 1} ถึง{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} จาก{" "}
            {filteredOrders.length} รายการ
          </div>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
