import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { orderService } from "../services/order.service";
import { formatPrice } from "../helpers";
import { BiPackage, BiTime, BiCheck, BiX } from "react-icons/bi";
import { FaShippingFast } from "react-icons/fa";
import { Order } from "../interfaces";

export const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        navigate("/signin");
        return;
      }
      const data = await orderService.getUserOrders(user.id);
      setOrders(data as unknown as Order[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <BiTime className="w-5 h-5" />;
      case "processing":
        return <BiPackage className="w-5 h-5" />;
      case "shipped":
        return <FaShippingFast className="w-5 h-5" />;
      case "delivered":
        return <BiCheck className="w-5 h-5" />;
      case "cancelled":
        return <BiX className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "รอการยืนยัน";
      case "processing":
        return "กำลังดำเนินการ";
      case "shipped":
        return "จัดส่งแล้ว";
      case "delivered":
        return "ได้รับสินค้าแล้ว";
      case "cancelled":
        return "ยกเลิก";
      default:
        return status;
    }
  };

  if (loading)
    return <div className="flex justify-center py-12">กำลังโหลด...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-12">
        เกิดข้อผิดพลาด: {error}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ประวัติการสั่งซื้อทั้งหมด</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BiPackage className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-500 text-lg">ยังไม่มีประวัติการสั่งซื้อ</h3>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        คำสั่งซื้อ #{order.id}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      วันที่สั่งซื้อ:{" "}
                      {new Date(order.created_at).toLocaleDateString("th-TH")}
                    </p>
                  </div>
                  <p className="text-xl font-semibold text-indigo-600">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">
                          จำนวน: {item.quantity} ชิ้น
                        </p>
                        <p className="text-sm text-gray-500">
                          สี:{" "}
                          {item.variant?.color_name || "-"}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(
                          (item.variant?.price || 0) * item.quantity
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-medium mb-2">ข้อมูลการจัดส่ง</h4>
                  <p className="text-sm text-gray-600">
                    {order.shipping_address.fullName}
                    <br />
                    {order.shipping_address.address}
                    <br />
                    {order.shipping_address.province}{" "}
                    {order.shipping_address.postalCode}
                    <br />
                    โทร: {order.shipping_address.phone}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
