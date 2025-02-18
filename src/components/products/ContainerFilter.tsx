import { Separator } from "../shared/Separator";

const availableBrands = [
  "Fiction",
  "Business & Finance",
  "Health & Fitness",
  "Education",
  "Technology",
  "Travel",
  "Cookbooks",
  "Design & Art",
  "Children & Young Adult",
];

interface Props {
  onBrandSelect: (brand: string) => void;
  selectedBrand: string | null;
}

export const ContainerFilter = ({ onBrandSelect, selectedBrand }: Props) => {
  const handleBrandChange = (brand: string) => {
    if (selectedBrand === brand) {
      onBrandSelect(""); // ยกเลิกการเลือกแบรนด์
    } else {
      onBrandSelect(brand);
    }
  };

  return (
    <div className="p-5 border border-slate-200 rounded-lg h-fit col-span-2 lg:col-span-1">
      <h3 className="font-semibold text-xl mb-4">ตัวกรอง</h3>

      {/* เส้นคั่น */}
      <Separator />

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-medium text-black">Category</h3>

        <div className="flex flex-col gap-2">
          {availableBrands.map((brand) => (
            <label key={brand} className="inline-flex items-center">
              <input
                type="checkbox"
                className="text-black border-black focus:ring-black accent-black"
                checked={selectedBrand === brand}
                onChange={() => handleBrandChange(brand)}
              />
              <span className="ml-2 text-black text-sm cursor-pointer">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
