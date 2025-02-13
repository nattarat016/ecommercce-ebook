import toast, { ToastPosition, ToastOptions } from 'react-hot-toast';

// Default toast configuration
export const toastConfig: ToastOptions = {
    position: 'bottom-right' as ToastPosition,
    duration: 3000,
    style: {
        background: '#fff',
        color: '#333',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
};

// Custom toast functions with consistent styling
export const showToast = {
    success: (message: string) => toast.success(message, toastConfig),
    error: (message: string) => toast.error(message, toastConfig),
    loading: (message: string) => toast.loading(message, toastConfig),
    promise: <T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) =>
        toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            toastConfig
        ),
}; 