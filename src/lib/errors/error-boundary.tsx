/**
 * React Error Boundary Component
 * Catches and handles React component errors
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { BaseError, ErrorSeverity } from './types';
import { handleError } from './error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'global';
}

interface State {
  hasError: boolean;
  error?: BaseError;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const processedError = handleError(error, {
      additionalData: {
        componentStack: errorInfo.componentStack,
        errorBoundaryLevel: this.props.level || 'component',
      },
    });

    this.setState({ error: processedError });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
          level={this.props.level}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: BaseError;
  onRetry: () => void;
  onReload: () => void;
  level?: string;
}

function ErrorFallback({ error, onRetry, onReload, level }: ErrorFallbackProps) {
  const isGlobalError = level === 'global';
  const isPageError = level === 'page';

  return (
    <div className={`error-boundary ${isGlobalError ? 'min-h-screen' : 'min-h-[200px]'} flex items-center justify-center p-6`}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-red-200 p-6 text-center">
        <div className="mb-4">
          {isGlobalError ? (
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isGlobalError ? 'Ứng dụng gặp sự cố' : 'Có lỗi xảy ra'}
        </h3>

        <p className="text-gray-600 mb-4">
          {error?.userMessage || 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'}
        </p>

        {error?.suggestions && error.suggestions.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-800 mb-1">Gợi ý:</p>
            <ul className="text-sm text-blue-700 list-disc list-inside">
              {error.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          {!isGlobalError && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          )}
          
          <button
            onClick={onReload}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Tải lại trang
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Chi tiết lỗi (Development)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(error.toJSON(), null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Specialized error boundaries for different contexts
export const GlobalErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary level="global">{children}</ErrorBoundary>
);

export const PageErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary level="page">{children}</ErrorBoundary>
);

export const ComponentErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary level="component">{children}</ErrorBoundary>
);
