import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { VariantProduct } from "../../interfaces";
import { formatPrice } from "../../helpers";

interface Props {
  img: string;
  name: string;
  price: number;
  slug: string;
  colors: { name: string; color: string }[];
  variants: VariantProduct[];
}

export const CardProduct = ({
  img,
  name,
  price,
  slug,
  colors = [],
  variants = [],
}: Props) => {
  const [activeColor, setActiveColor] = useState<{
    name: string;
    color: string;
  }>(colors[0] || { name: "", color: "" });

  // ระบุตัวเลือกที่เลือกตามสีที่เลือก
  const selectedVariant = variants.find(
    (variant) => variant.color === activeColor?.color
  );

  // คำนวณจำนวนสินค้าคงเหลือทั้งหมด
  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

  // หาราคาต่ำสุดและสูงสุดของ variants
  const variantPrices = variants.map((v) => v.price);
  const minPrice = Math.min(...variantPrices, price);
  const maxPrice = Math.max(...variantPrices, price);

  return (
    <div className="flex flex-col gap-6 relative">
      <Link
        to={`/celulares/${slug}`}
        className="flex relative group overflow-hidden"
      >
        <div className="flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]">
          <img src={img} alt={name} className="object-contain h-full w-full" />
        </div>

        {totalStock > 0 && (
          <button className="bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0">
            <FiPlus />
            ดูรายละเอียด
          </button>
        )}
      </Link>

      <div className="flex flex-col gap-1 items-center">
        <p className="text-[15px] font-medium">{name}</p>
        <p className="text-[15px] font-medium">
          {minPrice === maxPrice
            ? formatPrice(minPrice)
            : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
        </p>

        {colors.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-3">
              {colors.map((color) => {
                const variant = variants.find((v) => v.color === color.color);
                const isOutOfStock = variant?.stock === 0;

                return (
                  <button
                    key={color.color}
                    onClick={() => setActiveColor(color)}
                    disabled={isOutOfStock}
                    className={`relative grid place-items-center w-5 h-5 rounded-full cursor-pointer ${
                      activeColor?.color === color.color
                        ? "ring-2 ring-offset-1 ring-black"
                        : ""
                    } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={`${color.name}${
                      isOutOfStock
                        ? " (สินค้าหมด)"
                        : ` - ${variant?.storage || ""}`
                    }`}
                  >
                    <span
                      className="w-[14px] h-[14px] rounded-full"
                      style={{
                        backgroundColor: color.color,
                      }}
                    />
                    {isOutOfStock && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="block w-full h-[1px] bg-red-500 transform rotate-45" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedVariant && (
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  {selectedVariant.color_name} - {selectedVariant.storage}
                </p>
                <p className="text-xs text-gray-500">
                  เหลือ {selectedVariant.stock} ชิ้น
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {totalStock === 0 && (
        <div className="absolute top-2 left-2">
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
            สินค้าหมด
          </span>
        </div>
      )}
    </div>
  );
};
