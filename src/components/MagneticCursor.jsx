import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const MagneticCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);
    const cursorRef = useRef(null);
    const rafId = useRef(null);

    useEffect(() => {
        
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return; 

        let targetX = -100;
        let targetY = -100;
        let currentX = -100;
        let currentY = -100;

        const handleMouseMove = (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        };

        let lastFrameTime = 0;
        const targetFPS = 30; 
        const frameInterval = 1000 / targetFPS;

        const updateCursor = (currentTime) => {
            const deltaTime = currentTime - lastFrameTime;

            if (deltaTime >= frameInterval) {
                lastFrameTime = currentTime - (deltaTime % frameInterval);

                
                currentX += (targetX - currentX) * 0.15;
                currentY += (targetY - currentY) * 0.15;

                setMousePosition({ x: currentX, y: currentY });
            }

            rafId.current = requestAnimationFrame(updateCursor);
        };

        
        const checkHover = (e) => {
            const target = e.target;
            const isInteractive = target.closest('button, a, input, textarea, [role="button"], .magnetic');
            setIsHovering(!!isInteractive);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', checkHover);

        rafId.current = requestAnimationFrame(updateCursor);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', checkHover);
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, []);

    
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        return null;
    }

    return (
        <motion.div
            ref={cursorRef}
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{
                x: mousePosition.x,
                y: mousePosition.y,
            }}
        >
            {}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: isHovering ? '48px' : '32px',
                    height: isHovering ? '48px' : '32px',
                    left: isHovering ? '-24px' : '-16px',
                    top: isHovering ? '-24px' : '-16px',
                    background: isHovering
                        ? 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                }}
                animate={{
                    scale: isHovering ? 1.1 : 1,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                }}
            />

            {}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: '6px',
                    height: '6px',
                    left: '-3px',
                    top: '-3px',
                    backgroundColor: 'rgba(168, 85, 247, 0.6)',
                    boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)',
                }}
                animate={{
                    scale: isHovering ? 0.8 : 1,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                }}
            />
        </motion.div>
    );
};

export default MagneticCursor;
