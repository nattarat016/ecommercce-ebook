import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { showToast } from "../utils/toast";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    age: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { email, username, password, confirmPassword, age } = formData;

      if (!email || !password || !confirmPassword || !username || !age) {
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

      const { user } = await authService.signUp(
        email,
        password,
        username,
        parseInt(age)
      );

      if (user) {
        showToast.success("ลงทะเบียนสำเร็จ");
        navigate("/", {
          state: {
            message: "ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ",
          },
        });
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      showToast.error(err.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl border border-white/20">
        <div className="transform transition-all duration-500 animate-fadeIn">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 animate-slideDown">
            สมัครสมาชิกใหม่
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 animate-fadeIn">
            หรือ{" "}
            <button
              onClick={() => navigate("/signin")}
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200 hover:underline"
            >
              เข้าสู่ระบบ
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6 animate-fadeIn" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50/80 backdrop-blur-sm p-4 animate-shake">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            {[
              {
                id: "email-address",
                name: "email",
                type: "email",
                label: "อีเมล",
                placeholder: "กรอกอีเมลของคุณ",
                autoComplete: "email",
              },
              {
                id: "username",
                name: "username",
                type: "text",
                label: "ชื่อผู้ใช้",
                placeholder: "กรอกชื่อผู้ใช้ของคุณ",
                autoComplete: "username",
              },
              {
                id: "age",
                name: "age",
                type: "number",
                label: "อายุ",
                placeholder: "กรอกอายุของคุณ",
                autoComplete: "off",
              },
              {
                id: "password",
                name: "password",
                type: "password",
                label: "รหัสผ่าน",
                placeholder: "กรอกรหัสผ่านของคุณ",
                autoComplete: "new-password",
              },
              {
                id: "confirm-password",
                name: "confirmPassword",
                type: "password",
                label: "ยืนยันรหัสผ่าน",
                placeholder: "กรอกรหัสผ่านอีกครั้ง",
                autoComplete: "new-password",
              },
            ].map((field) => (
              <div
                key={field.id}
                className="transform transition-all duration-300 hover:translate-x-1"
              >
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-300 focus:translate-x-1 bg-white/50 backdrop-blur-sm"
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  กำลังดำเนินการ...
                </span>
              ) : (
                "สมัครสมาชิก"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
