'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-cyan-500 border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-300">{message}</p>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onDismiss, className = '' }: ErrorMessageProps) {
  return (
    <div className={`p-4 bg-red-500/20 border border-red-500 rounded-lg ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="text-red-400 text-lg">⚠️</span>
          <p className="text-sm text-red-200">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-300 transition-colors"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export function SuccessMessage({ message, onDismiss, className = '' }: ErrorMessageProps) {
  return (
    <div className={`p-4 bg-green-500/20 border border-green-500 rounded-lg ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="text-green-400 text-lg">✓</span>
          <p className="text-sm text-green-200">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-green-400 hover:text-green-300 transition-colors"
            aria-label="Dismiss message"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
