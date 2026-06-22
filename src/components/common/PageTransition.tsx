'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [displayChildren, setDisplayChildren] = useState(children);
    const [transitionStage, setTransitionStage] = useState('fadeIn');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setTransitionStage('fadeOut');
    }, [pathname]);

    useEffect(() => {
        if (transitionStage === 'fadeOut') {
            const timer = setTimeout(() => {
                setDisplayChildren(children);
                setTransitionStage('fadeIn');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [transitionStage, children]);

    return (
        <div
            className={`page-transition ${transitionStage === 'fadeOut' ? 'opacity-0' : 'opacity-100'
                } transition-opacity duration-300 ease-out`}
            aria-hidden={transitionStage === 'fadeOut'}
        >
            {displayChildren}
        </div>
    );
}
