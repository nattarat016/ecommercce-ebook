import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { formatPrice } from "../../helpers";

interface Props {
  img: string;
  name: string;
  price: number;
  colors: { name: string; color: string }[];
}

export const CardProduct = ({
  img,
  name,
  price,

  colors = [],
}: Props) => {
  const [activeColor, setActiveColor] = useState<{
    name: string;
    color: string;
  }>(colors[0] || { name: "", color: "" });

  return (
    <div className="flex flex-col gap-6 relative">
      <Link
        to={`/ebooks/${name}`}
        className="flex relative group overflow-hidden"
      >
        <div className="flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]">
          <img src={img} alt={name} className="object-contain h-full w-full" />
        </div>

        <button className="bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0">
          <FiPlus />
          ดูรายละเอียด
        </button>
      </Link>

      <div className="flex flex-col gap-1 items-center">
        <p className="text-[15px] font-medium">{name}</p>
        <p className="text-[15px] font-medium">
          {price > 0 ? formatPrice(price) : "GRATIS"}
        </p>

        {colors.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color.color}
                  onClick={() => setActiveColor(color)}
                  className={`relative grid place-items-center w-5 h-5 rounded-full cursor-pointer ${
                    activeColor?.color === color.color
                      ? "ring-2 ring-offset-1 ring-black"
                      : ""
                  }`}
                  title={color.name}
                >
                  <span
                    className="w-[14px] h-[14px] rounded-full"
                    style={{
                      backgroundColor: color.color,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
