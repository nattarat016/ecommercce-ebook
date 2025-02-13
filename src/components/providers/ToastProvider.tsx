import { Toaster } from "react-hot-toast";
import { toastConfig } from "../../utils/toast";

export const ToastProvider = () => {
  return <Toaster position={toastConfig.position} toastOptions={toastConfig} />;
};
