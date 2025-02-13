import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/auth.service";
import {
  BiPackage,
  BiCube,
  BiLogOut,
  BiMenu,
  BiX,
  BiHomeAlt,
} from "react-icons/bi";
import { supabase } from "../lib/supabase";

const adminLinks = [
  {
    title: "แดชบอร์ด",
    href: "/admin",
    icon: <BiHomeAlt className="w-5 h-5" />,
  },
  {
    title: "คำสั่งซื้อ",
    href: "/admin/orders",
    icon: <BiPackage className="w-5 h-5" />,
  },
  {
    title: "สินค้า",
    href: "/admin/products",
    icon: <BiCube className="w-5 h-5" />,
  },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        navigate("/signin");
        return;
      }

      // ตรวจสอบ admin role จากตาราง profiles
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("user_id", currentUser.id)
        .single();

      if (error) throw error;

      if (!profileData?.is_admin) {
        alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์");
      navigate("/signin");
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      // Clear any stored data if needed
      localStorage.clear(); // หรือลบเฉพาะ key ที่ต้องการ
      // Force redirect to signin
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
      alert("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <Link to="/admin" className="text-xl font-bold text-gray-800">
              Admin Panel
            </Link>
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <BiX className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === link.href
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.icon}
                <span>{link.title}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors w-full px-4 py-2 rounded-lg hover:bg-red-50"
            >
              <BiLogOut className="w-5 h-5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <BiMenu className="w-6 h-6" />
            </button>

            <div className="flex items-center">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                ผู้ดูแลระบบ
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
