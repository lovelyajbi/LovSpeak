
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-500 font-medium mb-8">
              Aplikasi mengalami kendala teknis. Silakan coba muat ulang halaman.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-gray-800 transition active:scale-95"
            >
              Reload App
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-gray-100 rounded-xl text-left text-xs overflow-auto max-h-40 text-rose-600 font-mono">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
