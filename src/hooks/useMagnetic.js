import { useEffect, useRef } from 'react';


const useMagnetic = (strength = 0.3) => {
    const ref = useRef(null);
    const position = useRef({ x: 0, y: 0 });
    const animationFrameId = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return; 

        let bounds = element.getBoundingClientRect();
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleMouseEnter = () => {
            bounds = element.getBoundingClientRect();
        };

        const animate = () => {
            const centerX = bounds.left + bounds.width / 2;
            const centerY = bounds.top + bounds.height / 2;

            const deltaX = mouseX - centerX;
            const deltaY = mouseY - centerY;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

            
            const maxDistance = Math.max(bounds.width, bounds.height) * 1.5;

            if (distance < maxDistance) {
                
                targetX = deltaX * strength;
                targetY = deltaY * strength;
            } else {
                targetX = 0;
                targetY = 0;
            }

            
            position.current.x += (targetX - position.current.x) * 0.15;
            position.current.y += (targetY - position.current.y) * 0.15;

            element.style.transform = `translate(${position.current.x}px, ${position.current.y}px) scale(${distance < maxDistance ? 1.03 : 1})`;

            animationFrameId.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseenter', handleMouseEnter);

        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseenter', handleMouseEnter);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            if (element) {
                element.style.transform = '';
            }
        };
    }, [strength]);

    return ref;
};

export default useMagnetic;
