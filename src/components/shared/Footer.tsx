import { BiChevronRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import { socialLinks } from "../../constants/links";

export const Footer = () => {
  return (
    <footer className="bg-gray-900">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-white">
              Libria
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              ร้านค้าหนังสืออิเล็กทรอนิกส์ออนไลน์ที่คุณไว้วางใจได้ พร้อมให้บริการตลอด
              24 ชั่วโมง
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">เมนูลัด</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/celulares"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  สินค้าทั้งหมด
                </Link>
              </li>
              <li>
                <Link
                  to="/nosotros"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ติดตามคำสั่งซื้อ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">รับข่าวสาร</h3>
            <p className="text-gray-400 text-sm">
              อัพเดทข่าวสารและโปรโมชั่นก่อนใคร
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="อีเมลของคุณ"
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <button className="bg-gray-600 text-white px-4 py-2 rounded-r-lg hover:bg-stone-400 transition-colors">
                <BiChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">ติดตามเรา</h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:bg-stone-600 hover:text-white transition-all duration-300"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Libria. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                นโยบายความเป็นส่วนตัว
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                ข้อกำหนดการใช้งาน
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
