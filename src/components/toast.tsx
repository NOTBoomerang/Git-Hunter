"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 15);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      // Keep only the most recent maxToasts
      return updated.slice(0, maxToasts);
    });

    // Auto-hide toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, newToast.duration);
    }
  }, [maxToasts]);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[toast.type];

  const baseClasses = "pointer-events-auto relative flex w-full max-w-sm items-start space-x-3 rounded-lg p-4 shadow-lg ring-1 ring-black ring-opacity-5";
  
  const typeClasses = {
    success: "bg-green-50 ring-green-200",
    error: "bg-red-50 ring-red-200", 
    warning: "bg-yellow-50 ring-yellow-200",
    info: "bg-blue-50 ring-blue-200",
  };

  const iconClasses = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500", 
    info: "text-blue-500",
  };

  const textClasses = {
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(baseClasses, typeClasses[toast.type])}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", iconClasses[toast.type])} />
      
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", textClasses[toast.type])}>
          {toast.title}
        </p>
        {toast.message && (
          <p className={cn("text-sm mt-1 opacity-90", textClasses[toast.type])}>
            {toast.message}
          </p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className={cn(
              "text-sm font-medium underline hover:no-underline mt-2",
              textClasses[toast.type]
            )}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => onClose(toast.id)}
        className={cn(
          "flex-shrink-0 rounded-md p-1 hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2",
          toast.type === 'success' && "focus:ring-green-500",
          toast.type === 'error' && "focus:ring-red-500", 
          toast.type === 'warning' && "focus:ring-yellow-500",
          toast.type === 'info' && "focus:ring-blue-500"
        )}
      >
        <X className={cn("h-4 w-4", textClasses[toast.type])} />
      </button>
    </motion.div>
  );
}

// Convenience hooks for different toast types
export function useErrorToast() {
  const { showToast } = useToast();
  
  return useCallback((title: string, message?: string, action?: Toast['action']) => {
    showToast({ type: 'error', title, message, action });
  }, [showToast]);
}

export function useSuccessToast() {
  const { showToast } = useToast();
  
  return useCallback((title: string, message?: string, action?: Toast['action']) => {
    showToast({ type: 'success', title, message, action });
  }, [showToast]);
}

export function useWarningToast() {
  const { showToast } = useToast();
  
  return useCallback((title: string, message?: string, action?: Toast['action']) => {
    showToast({ type: 'warning', title, message, action });
  }, [showToast]);
}

export function useInfoToast() {
  const { showToast } = useToast();
  
  return useCallback((title: string, message?: string, action?: Toast['action']) => {
    showToast({ type: 'info', title, message, action });
  }, [showToast]);
}