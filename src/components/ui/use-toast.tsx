import React, { createContext, useContext, useState } from "react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  toast: () => {},
  dismissToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({
    title,
    description,
    duration = 3000,
  }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, title, description, duration },
    ]);

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  };

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismissToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useContext(ToastContext);

  if (toasts.length === 0) return null;

  return (
    <div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2'>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className='bg-white border border-orange-100 p-4 rounded-lg shadow-md flex flex-col gap-1 min-w-[300px] max-w-[400px] animate-slide-in'
          style={{ animationDuration: "150ms" }}>
          <div className='flex justify-between items-center'>
            <h3 className='font-medium text-gray-800'>{toast.title}</h3>
            <button
              onClick={() => dismissToast(toast.id)}
              className='text-gray-500 hover:text-gray-700'>
              &times;
            </button>
          </div>
          {toast.description && (
            <p className='text-sm text-gray-600'>{toast.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    toast: context.toast,
    dismissToast: context.dismissToast,
  };
};

// CSS for the animation
const style = document.createElement("style");
style.textContent = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.15s ease-out forwards;
  }
`;
document.head.appendChild(style);
