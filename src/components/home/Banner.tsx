import { Link } from "react-router-dom";

export const Banner = () => {
	return (
    <div className="relative bg-gray-900 text-white">
      {/* ภาพพื้นหลัง */}
			<div
        className="absolute inset-0 bg-cover bg-center opacity-70 h-full"
        style={{ backgroundImage: "url(/img/file-Wc5q8ejt4yJL1nAF3ioBkv.webp)" }}
			/>

      {/* เลเยอร์ทับ */}
      <div className="absolute inset-0 bg-black opacity-50" />

      {/* เนื้อหา */}
      <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4 text-center lg:py-40 lg:px-8">
        <h1 className="text-4xl font-bold mb-4 lg:text-6xl">
          หนังสืออิเล็กทรอนิกส์ที่ดีที่สุดแห่งปี 2024
				</h1>

        <p className="text-lg mb-8 lg:text-2xl">
          ค้นพบข้อเสนอพิเศษและ E-Book ใหม่ล่าสุด
				</p>

				<Link
          to="/celulares"
          className="bg-rose-400 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
				>
          ดู E-Book
				</Link>
			</div>
		</div>
	);
};
