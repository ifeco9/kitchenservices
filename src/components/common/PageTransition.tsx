'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [displayChildren, setDisplayChildren] = useState(children);
    const [transitionStage, setTransitionStage] = useState('fadeIn');

    useEffect(() => {
        setTransitionStage('fadeOut');
    }, [pathname]);

    useEffect(() => {
        if (transitionStage === 'fadeOut') {
            const timer = setTimeout(() => {
                setDisplayChildren(children);
                setTransitionStage('fadeIn');
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [transitionStage, children]);

    return (
        <div
            className={`page-transition ${transitionStage === 'fadeOut' ? 'opacity-0' : 'opacity-100'
                } transition-opacity duration-300 ease-out`}
        >
            {displayChildren}
        </div>
    );
}
