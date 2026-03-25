import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const spotlightRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;
        const spotlight = spotlightRef.current;

        const isMouse = window.matchMedia('(pointer: fine)').matches;
        if (!isMouse || !cursor || !follower || !spotlight) return;

        const onMouseMove = (e) => {
            const { clientX: x, clientY: y } = e;
            
            // Fast Dot
            gsap.to(cursor, {
                x, y,
                duration: 0.1,
                ease: "none"
            });

            // Fluid Ring
            gsap.to(follower, {
                x, y,
                duration: 0.4,
                ease: "power3.out"
            });

            // Large Spotlight
            gsap.to(spotlight, {
                x, y,
                duration: 1.2,
                ease: "power2.out"
            });
        };

        const handleHoverStart = (e) => {
            const isClickable = e.target.closest('button, a, input, [role="button"], .interactive');
            if (isClickable) {
                gsap.to(follower, { 
                    borderWidth: 2,
                    duration: 0.3
                });
            }
        };

        const handleHoverEnd = () => {
            gsap.to(follower, { 
                borderWidth: 1,
                duration: 0.3
            });
        };

        const onMouseDown = () => {
            gsap.to(cursor, { opacity: 0.5, duration: 0.2 });
        };
        
        const onMouseUp = () => {
            gsap.to(cursor, { opacity: 1, duration: 0.2 });
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', handleHoverStart);
        window.addEventListener('mouseout', handleHoverEnd);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', handleHoverStart);
            window.removeEventListener('mouseout', handleHoverEnd);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return (
        <>
            {/* Ambient Spotlight */}
            <div
                ref={spotlightRef}
                className="fixed top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full pointer-events-none z-[0] -translate-x-1/2 -translate-y-1/2 blur-[120px] hidden md:block"
            />
            
            {/* The Main Ring */}
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-10 h-10 border border-primary/40 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 hidden md:block transition-[border-width] duration-300"
                style={{ willChange: 'transform' }}
            />

            {/* The Precision Dot */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block shadow-primary-glow"
                style={{ willChange: 'transform' }}
            />
        </>
    );
}
