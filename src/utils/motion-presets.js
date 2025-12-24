


export const easings = {
    
    appleFluid: [0.19, 1, 0.22, 1],

    
    smoothOut: [0.16, 1, 0.3, 1],

    
    gentle: [0.4, 0, 0.2, 1],

    
    friction: [0.25, 0.46, 0.45, 0.94],

    
    inertia: [0.22, 1, 0.36, 1],

    
    tension: [0.68, -0.55, 0.265, 1.55],
};


export const springs = {
    
    default: {
        type: 'spring',
        stiffness: 220,
        damping: 26,
        mass: 0.9,
    },

    
    soft: {
        type: 'spring',
        stiffness: 180,
        damping: 24,
        mass: 1,
    },

    
    snappy: {
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.8,
    },

    
    gentle: {
        type: 'spring',
        stiffness: 150,
        damping: 22,
        mass: 1.1,
    },

    
    bouncy: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        mass: 0.7,
    },

    
    heavy: {
        type: 'spring',
        stiffness: 100,
        damping: 18,
        mass: 1.5,
    },
};


export const durations = {
    microHover: 0.15,      
    hoverSoft: 0.18,       
    clickConfirm: 0.2,     
    panelEnter: 0.35,      
    screenTransition: 0.5, 
    themeChange: 0.4,      
};


export const hoverSoft = {
    initial: { y: 0, scale: 1 },
    hover: {
        y: -3,
        scale: 1.01,
        transition: {
            ...springs.default,
            duration: durations.microHover,
        },
    },
    tap: {
        y: 0,
        scale: 0.98,
        transition: {
            ...springs.snappy,
            duration: durations.clickConfirm,
        },
    },
};


export const pressDepth = {
    initial: { scale: 1, y: 0 },
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.97, y: 2 },
    transition: springs.snappy,
};


export const panelEnter = {
    initial: {
        opacity: 0,
        y: 20,
        filter: 'blur(8px)',
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            ...springs.gentle,
            duration: durations.panelEnter,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        filter: 'blur(4px)',
        transition: {
            duration: durations.microHover,
            ease: easings.smoothOut,
        },
    },
};


export const listStagger = {
    container: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.06,
                delayChildren: 0.1,
            },
        },
    },
    item: {
        initial: {
            opacity: 0,
            y: 16,
            filter: 'blur(4px)',
        },
        animate: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                ...springs.default,
            },
        },
    },
};


export const emergencyPulse = {
    idle: {
        scale: 1,
        boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)',
    },
    breathing: {
        scale: [1, 1.015, 1],
        boxShadow: [
            '0 0 0 0 rgba(239, 68, 68, 0.4)',
            '0 0 20px 4px rgba(239, 68, 68, 0.25)',
            '0 0 0 0 rgba(239, 68, 68, 0.4)',
        ],
        transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
    hover: {
        scale: 1.03,
        boxShadow: '0 0 32px 8px rgba(239, 68, 68, 0.35)',
        transition: springs.snappy,
    },
    tap: {
        scale: 0.96,
        transition: springs.bouncy,
    },
};


export const rippleShockwave = {
    initial: {
        scale: 0,
        opacity: 0.6,
    },
    animate: {
        scale: 2.5,
        opacity: 0,
        transition: {
            duration: 0.6,
            ease: easings.smoothOut,
        },
    },
};


export const parallaxTilt = {
    maxTilt: 4,        
    perspective: 1000, 
    scale: 1.02,
    speed: 300,        
};


export const expandCollapse = {
    initial: { height: 0, opacity: 0 },
    animate: {
        height: 'auto',
        opacity: 1,
        transition: {
            height: springs.gentle,
            opacity: { duration: durations.microHover },
        },
    },
    exit: {
        height: 0,
        opacity: 0,
        transition: {
            height: { ...springs.snappy, duration: 0.25 },
            opacity: { duration: 0.15 },
        },
    },
};


export const deleteItem = {
    initial: { opacity: 1, scale: 1, x: 0 },
    exit: {
        opacity: 0,
        scale: 0.9,
        x: -50,
        transition: {
            opacity: { duration: 0.2 },
            scale: { duration: 0.25, ease: easings.smoothOut },
            x: { duration: 0.3, ease: easings.smoothOut },
        },
    },
};


export const tooltipReveal = {
    initial: { opacity: 0, scale: 0.95, y: 5 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: durations.microHover,
            ease: easings.smoothOut,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.1 },
    },
};


export const tabSlideIndicator = {
    initial: false,
    transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
    },
};


export const iosToggle = {
    knob: {
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 28,
            mass: 0.6,
        },
    },
    track: {
        transition: {
            duration: durations.clickConfirm,
            ease: easings.smoothOut,
        },
    },
};


export const dropdownFloat = {
    initial: {
        opacity: 0,
        y: -8,
        scale: 0.96,
        filter: 'blur(4px)',
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            ...springs.default,
            duration: durations.panelEnter,
        },
    },
    exit: {
        opacity: 0,
        y: -4,
        scale: 0.98,
        transition: {
            duration: 0.15,
            ease: easings.smoothOut,
        },
    },
};


export const sliderSnap = {
    transition: springs.bouncy,
    snapPoints: [0, 25, 50, 75, 100], 
};


export const savePulse = {
    initial: { scale: 1, opacity: 1 },
    animate: {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 0.4,
            ease: easings.smoothOut,
        },
    },
};


export const progressFill = {
    initial: { scaleX: 0, originX: 0 },
    animate: (value) => ({
        scaleX: value,
        transition: {
            ...springs.gentle,
            duration: 0.8,
        },
    }),
};


export const cursorProximity = {
    threshold: 15,      
    liftAmount: 3,      
    transitionMs: 150,  
};


export const shadowElevation = {
    idle: '0 2px 8px rgba(0, 0, 0, 0.08)',
    hover: '0 8px 24px rgba(0, 0, 0, 0.12)',
    pressed: '0 1px 4px rgba(0, 0, 0, 0.1)',
    transition: `box-shadow ${durations.microHover}s ${easings.smoothOut.join(',')}`,
};


export const getStaggerDelay = (index, baseDelay = 0.1, staggerAmount = 0.05) => {
    return baseDelay + (index * staggerAmount);
};


export const calculateTilt = (clientX, clientY, rect, maxTilt = 4) => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (clientX - centerX) / (rect.width / 2);
    const deltaY = (clientY - centerY) / (rect.height / 2);

    return {
        rotateX: -deltaY * maxTilt,
        rotateY: deltaX * maxTilt,
    };
};


export const motionSettings = {
    
    intensity: 1,

    
    durationScale: 1,

    
    respectReducedMotion: true,

    
    applySettings: (spring) => {
        const prefersReduced = typeof window !== 'undefined'
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced && motionSettings.respectReducedMotion) {
            return { duration: 0.01 }; 
        }

        return {
            ...spring,
            stiffness: spring.stiffness * motionSettings.intensity,
            damping: spring.damping * motionSettings.intensity,
        };
    },
};


export const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            ...springs.default,
        },
    }),
};


export const scaleEntryVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: springs.gentle,
    },
};


export const blurDissolveVariants = {
    hidden: {
        opacity: 0,
        filter: 'blur(8px)',
        y: 10,
    },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        transition: {
            ...springs.default,
            filter: { duration: 0.3 },
        },
    },
};

export default {
    easings,
    springs,
    durations,
    hoverSoft,
    pressDepth,
    panelEnter,
    listStagger,
    emergencyPulse,
    rippleShockwave,
    parallaxTilt,
    expandCollapse,
    deleteItem,
    tooltipReveal,
    tabSlideIndicator,
    iosToggle,
    dropdownFloat,
    sliderSnap,
    savePulse,
    progressFill,
    cursorProximity,
    shadowElevation,
    getStaggerDelay,
    calculateTilt,
    motionSettings,
    fadeUpVariants,
    scaleEntryVariants,
    blurDissolveVariants,
};
