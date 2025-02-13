export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden mb-16">
        <img
          src="https://plus.unsplash.com/premium_photo-1682716270464-9a91cbbcf3b7?fm=jpg&q=60&w=3000"
          alt="ภาพพื้นหลัง"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            เกี่ยวกับ MeowwwMobile
          </h1>
          <p className="text-lg text-gray-200">
            ร้านค้าโทรศัพท์มือถือที่คุณไว้วางใจได้
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-16 px-4">
        {/* About Us Section */}
        <section className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">เราคือใคร</h2>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-600 leading-relaxed mb-6">
              MeowwwMobile เป็นร้านค้าออนไลน์ที่จำหน่ายโทรศัพท์มือถือ
              ก่อตั้งขึ้นในปี 2021
              ด้วยเป้าหมายที่จะมอบสินค้าคุณภาพดีในราคาที่เหมาะสมให้กับลูกค้าของเรา
              เรามีทีมงานมืออาชีพที่คอยคัดสรรผลิตภัณฑ์ที่ดีที่สุดสำหรับคุณ
            </p>
            <p className="text-gray-600 leading-relaxed">
              ที่ MeowwwMobile
              คุณจะพบกับโทรศัพท์มือถือหลากหลายรุ่นจากแบรนด์ชั้นนำ
              นอกจากนี้เรายังมีโปรโมชั่นและส่วนลดพิเศษเพื่อให้คุณได้ซื้อโทรศัพท์มือถือในราคาที่ดีที่สุด
            </p>
          </div>
        </section>

        {/* Our Values Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            คุณค่าของเรา
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-indigo-600"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                คุณภาพเป็นเลิศ
              </h3>
              <p className="text-gray-600">
                เราคัดสรรสินค้าคุณภาพดีที่ผ่านการตรวจสอบมาตรฐานอย่างเข้มงวด
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ราคายุติธรรม
              </h3>
              <p className="text-gray-600">
                เรามุ่งมั่นที่จะให้บริการในราคาที่เป็นธรรมและคุ้มค่าที่สุด
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                บริการ 24/7
              </h3>
              <p className="text-gray-600">
                เรามีทีมงานพร้อมให้บริการและช่วยเหลือคุณตลอด 24 ชั่วโมง
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">ติดต่อเรา</h2>
          <div className="space-y-4">
            <p className="flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a
                href="mailto:contact@meowwwmobile.com"
                className="hover:underline"
              >
                contact@meowwwmobile.com
              </a>
            </p>
            <p className="flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a href="tel:1234567890" className="hover:underline">
                123-456-7890
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
