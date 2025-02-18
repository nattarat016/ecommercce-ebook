import { Link } from "react-router-dom";

export const OrderSuccessPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-lg px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">สั่งซื้อสำเร็จ!</h1>
          <p className="text-gray-600">
            ขอบคุณที่ไว้วางใจเลือกซื้อสินค้ากับเรา
            เราจะจัดส่งสินค้าให้คุณโดยเร็วที่สุด
          </p>
        </div>

        <div className="space-y-3">
          {/* <Link
            to="/orders"
            className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ดูรายการสั่งซื้อ
          </Link> */}
          <Link
            to="/"
            className="block w-full bg-white text-emerald-500 py-3 px-4 rounded-md border border-rose-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            กลับสู่หน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
};
