
import { useEffect, useRef, useCallback } from 'react';
import { setScale, setFrequency, resetFilter, prefersReducedMotion } from '../utils/liquidFilter';


const CONFIG = {
    maxTiltX: 8,       
    maxTiltY: 8,       
    maxScale: 25,      
    perspective: 800,  
    transitionDuration: 280,
    fps: 30,           
};


const useLiquidGlass = (ref, options = {}) => {
    const {
        enableTilt = true,
        enableDisplacement = true,
        enableOnlyWhenVisible = true,
    } = options;

    const isVisible = useRef(false);
    const isPointerDown = useRef(false);
    const rafId = useRef(null);
    const lastUpdate = useRef(0);
    const frameInterval = 1000 / CONFIG.fps;

    
    const reducedMotion = prefersReducedMotion();

    
    const handlePointerMove = useCallback((e) => {
        if (!ref.current || reducedMotion) return;
        if (enableOnlyWhenVisible && !isVisible.current) return;

        
        const now = performance.now();
        if (now - lastUpdate.current < frameInterval) return;
        lastUpdate.current = now;

        
        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
        }

        rafId.current = requestAnimationFrame(() => {
            const rect = ref.current?.getBoundingClientRect();
            if (!rect) return;

            
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

            
            if (enableTilt) {
                const rotateY = x * CONFIG.maxTiltX;
                const rotateX = -y * CONFIG.maxTiltY;
                const translateZ = isPointerDown.current ? 5 : 10;

                ref.current.style.transform = `
                    perspective(${CONFIG.perspective}px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateZ(${translateZ}px)
                    scale(${isPointerDown.current ? 0.98 : 1.02})
                `;
            }

            
            if (enableDisplacement) {
                const distance = Math.sqrt(x * x + y * y);
                const scale = distance * CONFIG.maxScale;
                const frequency = 0.01 + distance * 0.005;

                setScale(scale);
                setFrequency(frequency);
            }
        });
    }, [ref, enableTilt, enableDisplacement, enableOnlyWhenVisible, reducedMotion, frameInterval]);

    
    const handlePointerLeave = useCallback(() => {
        if (!ref.current) return;

        
        ref.current.style.transition = `transform ${CONFIG.transitionDuration}ms var(--motion-ease-spring, cubic-bezier(0.34, 1.56, 0.64, 1))`;
        ref.current.style.transform = '';

        
        if (enableDisplacement) {
            resetFilter();
        }

        
        setTimeout(() => {
            if (ref.current) {
                ref.current.classList.remove('pointer-active');
            }
        }, CONFIG.transitionDuration);
    }, [ref, enableDisplacement]);

    
    const handlePointerEnter = useCallback(() => {
        if (!ref.current || reducedMotion) return;
        ref.current.classList.add('pointer-active');
    }, [ref, reducedMotion]);

    
    const handlePointerDown = useCallback(() => {
        isPointerDown.current = true;
    }, []);

    const handlePointerUp = useCallback(() => {
        isPointerDown.current = false;
    }, []);

    
    useEffect(() => {
        if (!enableOnlyWhenVisible || !ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible.current = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [ref, enableOnlyWhenVisible]);

    
    useEffect(() => {
        const element = ref.current;
        if (!element || reducedMotion) return;

        
        if (enableTilt) {
            element.setAttribute('data-tilt', 'true');
        }

        element.addEventListener('pointermove', handlePointerMove, { passive: true });
        element.addEventListener('pointerleave', handlePointerLeave);
        element.addEventListener('pointerenter', handlePointerEnter);
        element.addEventListener('pointerdown', handlePointerDown);
        element.addEventListener('pointerup', handlePointerUp);

        return () => {
            element.removeEventListener('pointermove', handlePointerMove);
            element.removeEventListener('pointerleave', handlePointerLeave);
            element.removeEventListener('pointerenter', handlePointerEnter);
            element.removeEventListener('pointerdown', handlePointerDown);
            element.removeEventListener('pointerup', handlePointerUp);

            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [ref, handlePointerMove, handlePointerLeave, handlePointerEnter, handlePointerDown, handlePointerUp, enableTilt, reducedMotion]);

    return {
        isVisible: isVisible.current,
        reducedMotion,
    };
};

export default useLiquidGlass;
