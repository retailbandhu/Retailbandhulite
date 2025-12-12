import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { logger } from '../utils/logger';
import { isDevelopment } from '../utils/environment';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { extra: errorInfo });
    logger.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null
    });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-gray-900 text-center mb-2">
              कुछ गड़बड़ हो गई!
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-600 text-center mb-1">
              App में कोई problem आ गई है।
            </p>
            <p className="text-sm text-gray-500 text-center mb-6">
              Don't worry, aapka data safe hai! 🔒
            </p>

            {/* Error Details (Development only) */}
            {isDevelopment && this.state.error && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 max-h-40 overflow-auto">
                <p className="text-xs text-red-600 mb-2">
                  <strong>Error:</strong> {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={this.handleReset}
                className="w-full bg-gradient-to-r from-[#1E88E5] to-[#FF6F00] text-white h-12"
              >
                Home Screen Par Jayein
              </Button>
              
              <Button
                onClick={this.handleReload}
                variant="outline"
                className="w-full h-12"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Page Reload Karein
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-center text-xs text-gray-500 mt-6">
              Problem baar-baar aa rahi hai?
              <br />
              Settings → Data Backup se data save karein
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}