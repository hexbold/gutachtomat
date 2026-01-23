'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'info';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  title,
  message,
  type = 'success',
}: ConfirmationDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const iconColor = type === 'success' ? 'text-green-500' : 'text-blue-500';
  const buttonColor =
    type === 'success'
      ? 'bg-green-600 hover:bg-green-700'
      : 'bg-blue-600 hover:bg-blue-700';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-foreground/60 hover:text-foreground rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
            <CheckCircleIcon className={`w-10 h-10 ${iconColor}`} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-foreground/70 mb-6">{message}</p>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className={`w-full py-3 px-4 ${buttonColor} text-white font-semibold rounded-xl transition-colors`}
        >
          OK
        </button>
      </div>
    </div>,
    document.body
  );
}
