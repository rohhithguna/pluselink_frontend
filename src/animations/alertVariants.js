

export const alertVariants = {
    emergency: {
        initial: { scale: 0.98, opacity: 0, y: -10 },
        animate: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1], 
            }
        },
        exit: {
            scale: 0.95,
            opacity: 0,
            transition: { duration: 0.3 }
        },
    },
    important: {
        initial: { x: 20, opacity: 0 },
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
            }
        },
        exit: {
            x: -20,
            opacity: 0,
            transition: { duration: 0.3 }
        },
    },
    info: {
        initial: { y: -8, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
            }
        },
        exit: {
            y: 8,
            opacity: 0,
            transition: { duration: 0.3 }
        },
    },
    reminder: {
        initial: { scale: 0.95, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
            }
        },
        exit: {
            scale: 0.95,
            opacity: 0,
            transition: { duration: 0.3 }
        },
    },
};


export const queueItemVariants = {
    initial: { y: -100, opacity: 0 },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        }
    },
    exit: {
        y: -50,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        }
    },
};


export const reactionFloatVariant = {
    initial: { y: 0, scale: 1, opacity: 1 },
    animate: {
        y: -40,
        scale: 1.3,
        opacity: 0,
        transition: {
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
        }
    },
};
