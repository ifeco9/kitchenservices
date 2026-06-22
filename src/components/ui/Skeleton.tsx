import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: string;
    height?: string;
    lines?: number;
}

export default function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height,
    lines = 1,
}: SkeletonProps) {
    const baseClasses = 'skeleton animate-pulse';

    const variantClasses = {
        text: 'h-4 w-full rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
        card: 'rounded-xl',
    };

    const style: React.CSSProperties = {
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'circular' ? '40px' : variant === 'text' ? '16px' : '200px'),
    };

    if (variant === 'text' && lines > 1) {
        return (
            <div className={`space-y-2 ${className}`}>
                {Array.from({ length: lines }).map((_, index) => (
                    <div
                        key={index}
                        className={`${baseClasses} ${variantClasses[variant]}`}
                        style={{
                            ...style,
                            width: index === lines - 1 ? '80%' : '100%',
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
}

// Skeleton Card Component
export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-card rounded-xl p-6 shadow-card ${className}`}>
            <div className="flex items-center space-x-4 mb-4">
                <Skeleton variant="circular" width="48px" height="48px" />
                <div className="flex-1">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" className="mt-2" />
                </div>
            </div>
            <Skeleton variant="rectangular" height="120px" className="mb-4" />
            <Skeleton variant="text" lines={3} />
        </div>
    );
}

// Skeleton List Component
export function SkeletonList({ count = 3, className = '' }: { count?: number; className?: string }) {
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-card rounded-lg shadow-card">
                    <Skeleton variant="circular" width="56px" height="56px" />
                    <div className="flex-1">
                        <Skeleton variant="text" width="70%" />
                        <Skeleton variant="text" width="50%" className="mt-2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
