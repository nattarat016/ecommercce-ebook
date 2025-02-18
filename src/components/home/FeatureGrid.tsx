import { BiWorld } from "react-icons/bi";
import { FaHammer } from "react-icons/fa6";
import { HiMiniReceiptRefund } from "react-icons/hi2";
import { MdLocalShipping } from "react-icons/md";

export const FeatureGrid = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <MdLocalShipping size={32} className="text-stone-600" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">จัดส่งฟรี</p>
              <p className="text-sm text-gray-600">สำหรับสินค้าทุกชิ้น</p>
            </div>
          </div>
        </div>

        <div className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-rose-50 rounded-xl group-hover:bg-rose-100 transition-colors">
              <HiMiniReceiptRefund size={32} className="text-rose-600" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">คืนสินค้าได้</p>
              <p className="text-sm text-gray-600">
                คืนสินค้าได้ภายใน 72 ชั่วโมงหากไม่พอใจ
              </p>
            </div>
          </div>
        </div>

        <div className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
              <FaHammer size={32} className="text-amber-600" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">ช่วยเหลือ 24/7</p>
              <p className="text-sm text-gray-600">
                บริการช่วยเหลือด้านเทคนิคตลอด 24 ชั่วโมง
              </p>
            </div>
          </div>
        </div>

        <div className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <BiWorld size={32} className="text-emerald-600" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">รับประกัน</p>
              <p className="text-sm text-gray-600">
                รับประกันสินค้า 1 ปีสำหรับทุกเครื่อง
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
