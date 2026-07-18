'use client';

import {CheckCircle, XCircle, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useAdminLocale} from '@/hooks/useAdminLocale';

export type ToastType = 'success' | 'error';

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({message, type, onClose, duration = 3000}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const {isRTL} = useAdminLocale();

  useEffect(() => {
    // Slide in animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for slide-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles =
    type === 'success'
      ? {
          bg: 'rgba(63, 232, 244, 0.1)',
          border: 'rgba(63, 232, 244, 0.3)',
          text: '#3FE8F4',
          glow: '0 0 20px rgba(63, 232, 244, 0.2)'
        }
      : {
          bg: 'rgba(230, 60, 216, 0.1)',
          border: 'rgba(230, 60, 216, 0.3)',
          text: '#E63CD8',
          glow: '0 0 20px rgba(230, 60, 216, 0.2)'
        };

  return (
    <div
      className={`fixed top-6 z-50 transition-all duration-300 ${
        isRTL ? 'left-6' : 'right-6'
      } ${
        isVisible
          ? 'translate-x-0 opacity-100'
          : isRTL
          ? '-translate-x-full opacity-0'
          : 'translate-x-full opacity-0'
      }`}
      style={{boxShadow: styles.glow}}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-xl border px-4 py-3 min-w-[300px] max-w-md"
        style={{
          backgroundColor: styles.bg,
          borderColor: styles.border
        }}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          {type === 'success' ? (
            <CheckCircle
              className="w-5 h-5 flex-shrink-0"
              style={{color: styles.text}}
            />
          ) : (
            <XCircle
              className="w-5 h-5 flex-shrink-0"
              style={{color: styles.text}}
            />
          )}

          {/* Message */}
          <div className="flex-1 text-sm text-[#F2F4FF] leading-relaxed">
            {message}
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-[#8A91B0] hover:text-[#F2F4FF] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast container hook
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{id: number; message: string; type: ToastType}>
  >([]);
  const {isRTL} = useAdminLocale();

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, {id, message, type}]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{top: `${24 + index * 80}px`}}
          className={`fixed z-50 ${isRTL ? 'left-6' : 'right-6'}`}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );

  return {showToast, ToastContainer};
}
