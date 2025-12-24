import { useRef, useCallback, useEffect, useState } from 'react';


export const useLiquidOrb = (options = {}) => {
    const {
        maxTilt = 15,
        perspective = 200,
        scale = 1.08,
        transitionDuration = 400,
        breathingEnabled = true,
    } = options;

    const orbRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [transform, setTransform] = useState({
        rotateX: 0,
        rotateY: 0,
        scale: 1,
    });
    const animationFrameRef = useRef(null);

    
    const prefersReducedMotion = typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    
    const handlePointerMove = useCallback((e) => {
        if (prefersReducedMotion || !orbRef.current) return;

        const rect = orbRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
            setTransform({
                rotateX: -deltaY * maxTilt,
                rotateY: deltaX * maxTilt,
                scale: scale,
            });
        });
    }, [maxTilt, scale, prefersReducedMotion]);

    
    const handlePointerLeave = useCallback(() => {
        setIsHovered(false);
        setTransform({
            rotateX: 0,
            rotateY: 0,
            scale: 1,
        });
    }, []);

    
    const handlePointerEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    
    useEffect(() => {
        if (!orbRef.current || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(orbRef.current);

        return () => observer.disconnect();
    }, []);

    
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    
    const orbStyle = {
        transform: prefersReducedMotion
            ? 'none'
            : `perspective(${perspective}px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
        transition: `transform ${transitionDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    };

    
    const shouldBreathe = breathingEnabled && isVisible && !isHovered && !prefersReducedMotion;

    return {
        orbRef,
        orbStyle,
        isHovered,
        isVisible,
        shouldBreathe,
        handlers: {
            onPointerMove: handlePointerMove,
            onPointerEnter: handlePointerEnter,
            onPointerLeave: handlePointerLeave,
        },
    };
};

export default useLiquidOrb;
