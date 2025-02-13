export const Newsletter = () => {
	return (
    <div className="relative bg-gray-500 text-white py-20">
      {/* ภาพพื้นหลัง */}
			<div
        className="absolute inset-0 bg-cover bg-center opacity-70 h-full"
				style={{
          backgroundImage: "url(/img/background-newsletter.webp)",
				}}
			/>

      {/* เนื้อหาจดหมายข่าว */}
      <div className="container z-10 relative p-5 md:p-0">
        <div className="w-full text-black bg-white p-12 space-y-5 md:w-[50%] lg:w-[40%]">
          <p className="text-xs uppercase font-semibold">
            สมัครรับจดหมายข่าวและรับโปรโมชั่นพิเศษ
					</p>
          <p className="text-xs font-medium w-[80%] leading-5">
            กรอกอีเมลของคุณเพื่อรับข้อเสนอพิเศษ
					</p>
          <form className="flex flex-col gap-5 xl:flex-row">
						<input
              type="email"
              className="border border-slate-200 focus:outline-none rounded-full py-3 px-5 w-full text-xs font-medium"
              placeholder="อีเมล"
						/>

            <button className="bg-black text-white font-semibold rounded-full uppercase tracking-wider py-3 text-xs xl:px-5">
              สมัครรับข่าวสาร
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
