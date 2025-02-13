import {
  SiApple,
  SiSamsung,
  SiXiaomi,
  SiHuawei,
  SiOppo,
  SiVivo,
} from "react-icons/si";

export const Brands = () => {
  const brands = [
    { icon: SiApple, name: "Apple" },
    { icon: SiSamsung, name: "Samsung" },
    { icon: SiXiaomi, name: "Xiaomi" },
    { icon: SiHuawei, name: "Huawei" },
    { icon: SiOppo, name: "OPPO" },
    { icon: SiVivo, name: "Vivo" },
  ];

  // Duplicate brands for seamless scrolling
  const scrollingBrands = [...brands, ...brands];

  return (
    <div className="bg-gray-50 py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            แบรนด์ชั้นนำ
          </h2>
          <div className="mt-4 mx-auto w-24 h-1 bg-indigo-600 rounded-full"></div>
        </div>

        <div className="relative">
          {/* First row - scroll left */}
          <div className="flex animate-scroll-left">
            {scrollingBrands.map((brand, index) => (
              <div
                key={`left-${index}`}
                className="flex-none w-48 mx-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center">
                  <brand.icon
                    size={48}
                    className="text-gray-600 group-hover:text-indigo-600 transition-colors duration-300"
                  />
                  <p className="mt-4 font-medium text-gray-900">{brand.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Second row - scroll right */}
          <div className="flex animate-scroll-right mt-8">
            {scrollingBrands.reverse().map((brand, index) => (
              <div
                key={`right-${index}`}
                className="flex-none w-48 mx-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center">
                  <brand.icon
                    size={48}
                    className="text-gray-600 group-hover:text-indigo-600 transition-colors duration-300"
                  />
                  <p className="mt-4 font-medium text-gray-900">{brand.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
