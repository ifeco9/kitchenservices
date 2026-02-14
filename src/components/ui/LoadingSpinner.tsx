import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'primary' | 'accent' | 'white';
    className?: string;
}

export default function LoadingSpinner({
    size = 'md',
    color = 'primary',
    className = ''
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    const colorClasses = {
        primary: 'border-primary border-t-transparent',
        accent: 'border-accent border-t-transparent',
        white: 'border-white border-t-transparent',
    };

    return (
        <div
            className={`inline-block rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

// Full page loading component
export function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center">
                <LoadingSpinner size="lg" color="accent" />
                <p className="mt-4 text-sm text-muted-foreground animate-pulse-loading">Loading...</p>
            </div>
        </div>
    );
}

// Button loading state
export function ButtonLoader({ className = '' }: { className?: string }) {
    return (
        <LoadingSpinner size="sm" color="white" className={className} />
    );
}
