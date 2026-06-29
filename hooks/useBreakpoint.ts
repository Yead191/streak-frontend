import { useState, useEffect } from 'react';

const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState('');

    useEffect(() => {
        // Ensure this only runs on the client to avoid SSR hydration mismatches
        if (typeof window === 'undefined') return;

        const getBreakpoint = (width: number) => {
            if (width >= 1280) return 'xl';   // Extra Large
            if (width >= 1024) return 'lg';   // Large
            if (width >= 768) return 'md';    // Medium
            if (width >= 640) return 'sm';    // Small
            return 'xs';                      // Extra Small (Mobile)
        };

        const handleResize = () => {
            setBreakpoint(getBreakpoint(window.innerWidth));
        };

        // Initialize the size on first client-side load
        handleResize();

        // Listen for window resize events
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
};

export default useBreakpoint;