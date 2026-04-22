import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { X, CheckCircle2, XCircle, Info, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const timer = timeoutsRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [{ id, message, type }, ...prev].slice(0, 4)); // max 4 toasts

    const timer = setTimeout(() => dismiss(id), 3500);
    timeoutsRef.current.set(id, timer);
  }, [dismiss]);

  const success = useCallback((msg: string) => toast(msg, 'success'), [toast]);
  const error = useCallback((msg: string) => toast(msg, 'error'), [toast]);
  const info = useCallback((msg: string) => toast(msg, 'info'), [toast]);
  const warning = useCallback((msg: string) => toast(msg, 'warning'), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      <ToastRenderer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
};

/* ─── Toast Renderer ─────────────────────────────────────────────────────── */

const typeConfig: Record<ToastType, { icon: React.ReactNode; colorClass: string }> = {
  success: {
    icon: <CheckCircle2 size={18} />,
    colorClass: 'text-brand',
  },
  error: {
    icon: <XCircle size={18} />,
    colorClass: 'text-red-500',
  },
  warning: {
    icon: <AlertCircle size={18} />,
    colorClass: 'text-amber-500',
  },
  info: {
    icon: <Info size={18} />,
    colorClass: 'text-sky-500',
  },
};

interface ToastRendererProps {
  toasts: Toast[];
  dismiss: (id: string) => void;
}

const ToastRenderer: React.FC<ToastRendererProps> = ({ toasts, dismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 w-[calc(100%-2rem)] max-w-sm pointer-events-none"
    >
      {toasts.map(t => {
        const cfg = typeConfig[t.type];
        return (
          <div
            key={t.id}
            className={`
              pointer-events-auto w-full
              flex items-center gap-3
              bg-surface border border-line
              rounded-xl shadow-soft
              px-4 py-3.5
              animate-toast-in
            `}
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Icon */}
            <div className={`flex-shrink-0 flex items-center justify-center ${cfg.colorClass}`}>
              {cfg.icon}
            </div>

            {/* Message */}
            <p className="flex-1 text-sm font-medium text-text leading-snug">
              {t.message}
            </p>

            {/* Dismiss */}
            <button
              onClick={() => dismiss(t.id)}
              className="flex-shrink-0 rounded-full p-1 text-muted hover:bg-surface-muted transition-colors"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
