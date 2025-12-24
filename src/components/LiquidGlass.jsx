
import React, { useRef, forwardRef } from 'react';
import { motion } from 'framer-motion';
import useLiquidGlass from '../hooks/useLiquidGlass';


const GlassNoise = () => (
    <div
        className="glass-noise"
        aria-hidden="true"
    />
);


const LiquidGlass = forwardRef(({
    children,
    className = '',
    size = 'md',
    accent,
    enableTilt = true,
    enableDisplacement = false,
    enableHover = true,
    subtle = false,
    solid = false,
    as: Component = 'div',
    style = {},
    ...props
}, externalRef) => {
    const internalRef = useRef(null);
    const ref = externalRef || internalRef;

    
    useLiquidGlass(ref, {
        enableTilt,
        enableDisplacement,
        enableOnlyWhenVisible: true,
    });

    
    const sizeClass = size !== 'md' ? `liquid-glass-${size}` : '';
    const hoverClass = !enableHover ? 'glass-no-hover' : '';
    const variantClass = subtle ? 'glass-subtle' : solid ? 'glass-solid' : '';

    const combinedClassName = [
        'liquid-glass',
        sizeClass,
        hoverClass,
        variantClass,
        className,
    ].filter(Boolean).join(' ');

    
    const dataAttrs = {
        'data-tilt': enableTilt ? 'true' : undefined,
        'data-refract': enableDisplacement ? 'true' : undefined,
        'data-accent': accent || undefined,
    };

    return (
        <Component
            ref={ref}
            className={combinedClassName}
            style={style}
            {...dataAttrs}
            {...props}
        >
            <GlassNoise />
            <div className="glass-content">
                {children}
            </div>
        </Component>
    );
});

LiquidGlass.displayName = 'LiquidGlass';


export const LiquidCard = forwardRef(({
    children,
    className = '',
    style = {},
    ...props
}, ref) => (
    <div
        ref={ref}
        className={`liquid-card ${className}`}
        style={style}
        {...props}
    >
        {children}
    </div>
));

LiquidCard.displayName = 'LiquidCard';


export const MotionLiquidGlass = forwardRef(({
    children,
    className = '',
    initial = { opacity: 0, y: 20 },
    animate = { opacity: 1, y: 0 },
    transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    ...props
}, ref) => (
    <motion.div
        ref={ref}
        initial={initial}
        animate={animate}
        transition={transition}
    >
        <LiquidGlass className={className} {...props}>
            {children}
        </LiquidGlass>
    </motion.div>
));

MotionLiquidGlass.displayName = 'MotionLiquidGlass';

export default LiquidGlass;
