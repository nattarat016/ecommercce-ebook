import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { navbarLinks } from "../../constants/links";
import {
  BiCart,
  BiUser,
  BiSearch,
  BiMenu,
  BiChevronDown,
  BiHomeAlt,
  BiPhone,
  BiInfoCircle,
  BiLogOut,
  BiHistory,
  BiUserCircle,
} from "react-icons/bi";
import { authService } from "../../services/auth.service";
import { cartService } from "../../services/cart.service";
import { showToast } from "../../utils/toast";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const updateCartCount = async (userId?: string) => {
    if (userId) {
      // ถ้าล็อกอิน ดึงจำนวนสินค้าจาก server
      const cartItems = await cartService.getCartItems(userId);
      setCartCount(cartItems.length);
    } else {
      // ถ้าไม่ล็อกอิน ดึงจำนวนสินค้าจาก local storage
      const localItems = localStorage.getItem("cartItems");
      setCartCount(localItems ? JSON.parse(localItems).length : 0);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        updateCartCount(currentUser.id);
        const adminStatus = await authService.isAdmin(currentUser.id);
        setIsAdmin(adminStatus);
      } else {
        updateCartCount();
      }
    };
    checkAuth();

    const { data: authListener } = authService.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user);
        if (session?.user) {
          updateCartCount(session.user.id);
          const adminStatus = await authService.isAdmin(session.user.id);
          setIsAdmin(adminStatus);
        } else {
          updateCartCount();
        }
      }
    );

    // ตรวจสอบการเปลี่ยนแปลงของ local cart
    const checkLocalCart = () => {
      if (!user) {
        updateCartCount();
      }
    };

    // เพิ่ม event listener สำหรับ storage changes
    window.addEventListener("storage", checkLocalCart);

    // ปิดเมนูเมื่อคลิกนอกเมนู
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", checkLocalCart);
    };
  }, [user]);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      showToast.success("ออกจากระบบสำเร็จ");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      showToast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };

  const getNavIcon = (title: string) => {
    switch (title) {
      case "หน้าแรก":
        return <BiHomeAlt className="w-5 h-5" />;
      case "โทรศัพท์มือถือ":
        return <BiPhone className="w-5 h-5" />;
      case "เกี่ยวกับเรา":
        return <BiInfoCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                MeowwwMobile
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navbarLinks.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.href}
                  className={({ isActive }) =>
                    `inline-flex items-center px-3 py-1 text-sm font-medium transition-all duration-200  ${
                      isActive
                        ? " text-indigo-600"
                        : "text-gray-500 hover:text-indigo-600 "
                    }`
                  }
                >
                  {getNavIcon(link.title)}
                  <span className="ml-2">{link.title}</span>
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className="inline-flex items-center px-3 py-1 text-sm font-medium transition-all duration-200 text-indigo-600 hover:text-indigo-800"
                >
                  <span className="ml-2">แดชบอร์ด</span>
                </NavLink>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
              >
                <BiSearch className="h-5 w-5" />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 px-3 border border-gray-100">
                  <div className="flex items-center border-b border-gray-200 pb-2">
                    <BiSearch className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ค้นหาสินค้า..."
                      className="ml-2 flex-1 outline-none text-sm"
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/cart"
              className="relative p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
            >
              <BiCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                    {user.email[0].toUpperCase()}
                  </div>
                  <BiChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <BiUserCircle className="w-5 h-5 mr-2" />
                      โปรไฟล์
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <BiHistory className="w-5 h-5 mr-3" />
                      ประวัติการสั่งซื้อ
                    </Link>
                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleSignOut();
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all"
                      >
                        <BiLogOut className="w-5 h-5 mr-3" />
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                <BiUser className="h-5 w-5 mr-2" />
                เข้าสู่ระบบ
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
            >
              <BiMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            {navbarLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-base font-medium transition-all ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {getNavIcon(link.title)}
                <span className="ml-3">{link.title}</span>
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className="flex items-center px-4 py-2 text-base font-medium transition-all text-indigo-600 hover:text-indigo-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="ml-3">แดชบอร์ด</span>
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
