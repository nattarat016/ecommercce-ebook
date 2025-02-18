import { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div className="relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/img/foot.jpg)" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-stone-500/80" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            รับข่าวสารและโปรโมชั่น
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-300">
            สมัครรับจดหมายข่าวเพื่อรับข้อเสนอพิเศษและอัพเดทล่าสุดเกี่ยวกับสินค้าใหม่
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex max-w-md mx-auto gap-x-4"
          >
            <label htmlFor="email-address" className="sr-only">
              อีเมล
            </label>
            <div className="relative flex-auto">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <HiOutlineMail
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border-0 px-3.5 py-2 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                placeholder="กรอกอีเมลของคุณ"
              />
            </div>
            <button
              type="submit"
              className="flex-none rounded-lg bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300"
            >
              สมัครรับข่าวสาร
            </button>
          </form>
          {status === "success" && (
            <p className="mt-4 text-sm text-gray-200">
              ขอบคุณที่สมัครรับข่าวสาร! เราจะส่งข้อมูลไปยังอีเมลของคุณเร็วๆ นี้
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
