export const AboutPage = () => {
  return (
    <div className="space-y-5">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-5">
        เกี่ยวกับบริษัทของเรา
      </h1>

      <img
        src="https://plus.unsplash.com/premium_photo-1682716270464-9a91cbbcf3b7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWRpZmljaW8lMjBkZSUyMGxhJTIwZW1wcmVzYXxlbnwwfHwwfHx8MA%3D%3D"
        alt="ภาพพื้นหลัง"
        className="h-[500px] w-full object-cover"
      />

      <div className="flex flex-col gap-4 tracking-tighter leading-7 text-sm font-medium text-slate-800">
        <p>
          CelularesBaratos เป็นร้านค้าออนไลน์ที่จำหน่ายโทรศัพท์มือถือ
          ก่อตั้งขึ้นในปี 2021
          เป้าหมายของเราคือการมอบสินค้าคุณภาพดีในราคาที่เหมาะสมให้กับลูกค้าของเรา
          เรามีทีมงานมืออาชีพที่คอยคัดสรรผลิตภัณฑ์ที่ดีที่สุดสำหรับคุณ
        </p>

        <p>
          ที่ CelularesBaratos
          คุณจะพบกับโทรศัพท์มือถือหลากหลายรุ่นจากแบรนด์ชั้นนำ
          นอกจากนี้เรายังมีโปรโมชั่นและส่วนลดพิเศษเพื่อให้คุณได้ซื้อโทรศัพท์มือถือในราคาที่ดีที่สุด
        </p>

        <h2 className="text-3xl font-semibold tracking-tighh mt-8 mb-4">
          อย่ารอช้า! มาซื้อโทรศัพท์มือถือกับ CelularesBaratos วันนี้
        </h2>

        <p>
          สำหรับข้อมูลเพิ่มเติม สามารถติดต่อเราได้ทางอีเมล:
          <a href="mailto:correo@celularesbaratos.com">
            correo@celularesbaratos.com
          </a>{" "}
          หรือโทร <a href="tel:333333333">3333333333</a>
        </p>
      </div>
    </div>
  );
};
