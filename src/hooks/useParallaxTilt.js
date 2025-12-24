

import { useState, useCallback, useRef } from 'react';


const useParallaxTilt = (options = {}) => {
    const {
        maxTilt = 4,
        perspective = 1000,
        scale = 1.02,
        enabled = true,
    } = options;

    const ref = useRef(null);
    const [transform, setTransform] = useState({
        rotateX: 0,
        rotateY: 0,
        scale: 1,
    });

    const handleMouseMove = useCallback((e) => {
        if (!enabled || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        setTransform({
            rotateX: -deltaY * maxTilt,
            rotateY: deltaX * maxTilt,
            scale: scale,
        });
    }, [enabled, maxTilt, scale]);

    const handleMouseEnter = useCallback(() => {
        if (!enabled) return;
        setTransform(prev => ({ ...prev, scale }));
    }, [enabled, scale]);

    const handleMouseLeave = useCallback(() => {
        setTransform({
            rotateX: 0,
            rotateY: 0,
            scale: 1,
        });
    }, []);

    const style = {
        transform: enabled
            ? `perspective(${perspective}px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`
            : undefined,
        transition: 'transform 0.15s cubic-bezier(0.19, 1, 0.22, 1)',
        transformStyle: 'preserve-3d',
    };

    const handlers = {
        onMouseMove: handleMouseMove,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
    };

    return { ref, style, handlers, transform };
};

export default useParallaxTilt;


export const useCursorProximity = (options = {}) => {
    const {
        threshold = 15,
        liftAmount = 3,
        enabled = true,
    } = options;

    const ref = useRef(null);
    const [isNearby, setIsNearby] = useState(false);

    const checkProximity = useCallback((e) => {
        if (!enabled || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const expandedRect = {
            left: rect.left - threshold,
            right: rect.right + threshold,
            top: rect.top - threshold,
            bottom: rect.bottom + threshold,
        };

        const isInRange =
            e.clientX >= expandedRect.left &&
            e.clientX <= expandedRect.right &&
            e.clientY >= expandedRect.top &&
            e.clientY <= expandedRect.bottom;

        const isInsideElement =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

        setIsNearby(isInRange && !isInsideElement);
    }, [enabled, threshold]);

    const style = {
        transform: isNearby ? `translateY(-${liftAmount}px)` : 'translateY(0)',
        transition: 'transform 0.15s cubic-bezier(0.19, 1, 0.22, 1)',
    };

    return { ref, style, isNearby, checkProximity };
};


export const useShadowElevation = (options = {}) => {
    const {
        idle = '0 2px 8px rgba(0, 0, 0, 0.08)',
        hover = '0 8px 24px rgba(0, 0, 0, 0.12)',
        pressed = '0 1px 4px rgba(0, 0, 0, 0.1)',
    } = options;

    const [state, setState] = useState('idle');

    const getShadow = () => {
        switch (state) {
            case 'hover': return hover;
            case 'pressed': return pressed;
            default: return idle;
        }
    };

    const handlers = {
        onMouseEnter: () => setState('hover'),
        onMouseLeave: () => setState('idle'),
        onMouseDown: () => setState('pressed'),
        onMouseUp: () => setState('hover'),
    };

    const style = {
        boxShadow: getShadow(),
        transition: 'box-shadow 0.15s cubic-bezier(0.19, 1, 0.22, 1)',
    };

    return { style, handlers, state };
};
