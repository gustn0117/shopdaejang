"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Icon } from "./Icon";

type Toast = {
  id: number;
  message: string;
  variant: "success" | "error" | "info";
};

type ToastContextValue = {
  show: (message: string, variant?: Toast["variant"]) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, variant: Toast["variant"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((cur) => [...cur, { id, message, variant }]);
    setTimeout(() => {
      setToasts((cur) => cur.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const value: ToastContextValue = {
    show,
    success: (m) => show(m, "success"),
    error: (m) => show(m, "error"),
    info: (m) => show(m, "info"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[2000] flex flex-col items-end gap-2 pointer-events-none"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto inline-flex items-center gap-2 max-w-sm pl-4 pr-5 py-3 rounded-md shadow-lg border text-sm font-semibold animate-fade-up ${
              t.variant === "success"
                ? "bg-foreground text-white border-foreground"
                : t.variant === "error"
                ? "bg-white border-urgent text-urgent"
                : "bg-white border-border text-foreground"
            }`}
          >
            {t.variant === "success" && <Icon.Check size={14} strokeWidth={2.5} />}
            {t.variant === "error" && <Icon.Warning size={14} strokeWidth={2.2} />}
            {t.variant === "info" && <Icon.Info size={14} strokeWidth={2} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
