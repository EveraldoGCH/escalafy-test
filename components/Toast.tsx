'use client';

import { useNotifications } from '@/context/NotificationsContext';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const styles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
  info: 'bg-blue-50 border-blue-500 text-blue-800',
};

function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div className={`flex items-center justify-between gap-4 rounded border-l-4 px-4 py-3 shadow ${styles[type]}`}>
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="text-lg leading-none opacity-60 hover:opacity-100">
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismiss } = useNotifications();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => dismiss(t.id)} />
      ))}
    </div>
  );
}
