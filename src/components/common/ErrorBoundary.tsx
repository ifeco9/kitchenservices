'use client';

import React, { Component, ReactNode } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-error/10 rounded-full mb-4">
                            <Icon name="ExclamationTriangleIcon" size={32} className="text-error" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-text-secondary mb-6">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>
                        {this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm text-text-secondary hover:text-text-primary mb-2">
                                    Error details
                                </summary>
                                <pre className="text-xs bg-surface p-3 rounded border border-border overflow-auto max-h-32">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={this.handleReset}
                            className="w-full py-3 px-6 bg-accent text-accent-foreground rounded-lg hover:bg-success transition-smooth font-semibold"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
