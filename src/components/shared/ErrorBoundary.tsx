import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";

export const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = "เกิดข้อผิดพลาดที่ไม่คาดคิด";
  let errorTitle = "เกิดข้อผิดพลาด";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorTitle = "ไม่พบหน้าที่คุณต้องการ";
      errorMessage = "ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา";
    } else if (error.status === 401) {
      errorTitle = "ไม่ได้รับอนุญาต";
      errorMessage = "กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้";
    } else if (error.status === 503) {
      errorTitle = "ระบบไม่พร้อมใช้งาน";
      errorMessage = "ขออภัย ระบบอยู่ระหว่างการปรับปรุง กรุณาลองใหม่ภายหลัง";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-6 max-w-md w-full">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">{errorTitle}</h1>
          <p className="text-lg text-gray-600">{errorMessage}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            กลับไปหน้าก่อนหน้า
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            กลับสู่หน้าแรก
          </button>
        </div>
      </div>
    </div>
  );
};
