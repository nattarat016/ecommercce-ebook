import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { showToast } from "../utils/toast";
import { supabase } from "../lib/supabase";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password || !confirmPassword) {
        setError("กรุณากรอกข้อมูลให้ครบถ้วน");
        showToast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      if (password !== confirmPassword) {
        setError("รหัสผ่านไม่ตรงกัน");
        showToast.error("รหัสผ่านไม่ตรงกัน");
        return;
      }

      if (password.length < 6) {
        setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
        showToast.error("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
        return;
      }

      const { user } = await authService.signUp(email, password, "");

      if (user) {
        const { error } = await supabase.from("Users").insert([{ user_id: user.id }]);
        if (error) {
          console.error("Insert user error:", error);
          setError(error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
          showToast.error("เกิดข้อผิดพลาดในการสมัครสมาชิก");
        }
        showToast.success("ลงทะเบียนสำเร็จ");
        navigate("/signin", {
          state: {
            message: "ลงทะเบียนสำเร็จ",
          },
        });
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      showToast.error("เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            สมัครสมาชิกใหม่
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            หรือ{" "}
            <button
              onClick={() => navigate("/signin")}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              เข้าสู่ระบบ
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                อีเมล
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="อีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                ยืนยันรหัสผ่าน
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="ยืนยันรหัสผ่าน"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
