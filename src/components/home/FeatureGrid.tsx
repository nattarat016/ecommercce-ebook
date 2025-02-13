import { BiWorld } from "react-icons/bi";
import { FaHammer } from "react-icons/fa6";
import { HiMiniReceiptRefund } from "react-icons/hi2";
import { MdLocalShipping } from "react-icons/md";

export const FeatureGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-8 mt-6 mb-16 lg:grid-cols-4 lg:gap-5">
      <div className="flex items-center gap-6">
        <MdLocalShipping size={40} className="text-slate-600" />

        <div className="space-y-1">
          <p className="font-semibold">จัดส่งฟรี</p>
          <p className="text-sm">สำหรับสินค้าทุกชิ้น</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <HiMiniReceiptRefund size={40} className="text-slate-600" />

        <div className="space-y-1">
          <p className="font-semibold">คืนสินค้าได้</p>
          <p className="text-sm">คืนสินค้าได้ภายใน 72 ชั่วโมงหากไม่พอใจ</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <FaHammer size={40} className="text-slate-600" />

        <div className="space-y-1">
          <p className="font-semibold">ช่วยเหลือ 24/7</p>
          <p className="text-sm">บริการช่วยเหลือด้านเทคนิคตลอด 24 ชั่วโมง</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <BiWorld size={40} className="text-slate-600" />

        <div className="space-y-1">
          <p className="font-semibold">รับประกัน</p>
          <p className="text-sm">รับประกันสินค้า 1 ปีสำหรับทุกเครื่อง</p>
        </div>
      </div>
    </div>
  );
};
