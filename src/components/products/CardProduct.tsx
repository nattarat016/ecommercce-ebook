import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { formatPrice } from "../../helpers";

interface Props {
  img: string;
  title: string;
  price: number;
}

export const CardProduct = ({
  img,
  title,
  price,
}: Props) => {;

  return (
    <div className="flex flex-col gap-6 relative">
      <Link
        to={`/ebooks/${title}`} // Changed from name to slug
        className="flex relative group overflow-hidden"
      >
        <div className="flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]">
          <img src={img} alt={title} className="object-contain h-full w-full" />
        </div>

        <button className="bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0">
          <FiPlus />
          ดูรายละเอียด
        </button>
      </Link>

      <div className="flex flex-col gap-1 items-center">
        <p className="text-[15px] font-medium">{title}</p>
        <p className="text-[15px] font-medium">
          {price > 0 ? formatPrice(price) : "GRATIS"}
        </p>
      </div>
    </div>
  );
};
