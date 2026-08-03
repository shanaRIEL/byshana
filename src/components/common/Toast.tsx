"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

interface ToastItem {
  id: number;
  message: string;
  visible: boolean;
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, visible: false }]);

    requestAnimationFrame(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: true } : t))
      );
    });

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-3000 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-b1 text-b8 rounded-14px px-6 py-4 text-0.82rem font-medium font-montserrat"
            style={{
              transform: toast.visible ? "translateY(0)" : "translateY(100px)",
              opacity: toast.visible ? 1 : 0,
              transition: "transform 0.3s, opacity 0.3s",
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
