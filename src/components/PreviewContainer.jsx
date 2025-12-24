
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PreviewContainer = ({
    isVisible,
    title = 'Preview',
    children,
    onApply,
    onRevert,
    hasChanges = true,
}) => {
    const [isHoveringApply, setIsHoveringApply] = useState(false);
    const [isHoveringRevert, setIsHoveringRevert] = useState(false);
    const [ripple, setRipple] = useState(null);

    
    const handleApplyClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setRipple({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            id: Date.now(),
        });
        setTimeout(() => setRipple(null), 600);
        onApply?.();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.95 }}
                    transition={{
                        duration: 0.28,
                        ease: [0.22, 1, 0.36, 1], 
                    }}
                    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100]"
                    style={{
                        
                        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
                        backdropFilter: 'blur(28px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(28px) saturate(200%)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        boxShadow: `
                            0 12px 40px rgba(0, 0, 0, 0.15),
                            0 0 0 1px rgba(255, 255, 255, 0.08),
                            0 0 80px rgba(168, 85, 247, 0.15),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `,
                        width: 'min(340px, calc(100vw - 32px))',
                        maxHeight: '450px',
                        overflow: 'hidden',
                    }}
                >
                    {}
                    <motion.div
                        className="absolute inset-0 rounded-[20px] pointer-events-none"
                        animate={{
                            background: [
                                'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 100%)',
                                'linear-gradient(145deg, rgba(255,255,255,0.25) 0%, transparent 45%, transparent 100%)',
                                'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 100%)',
                            ],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            maskComposite: 'xor',
                            WebkitMaskComposite: 'xor',
                            padding: '1px',
                        }}
                    />

                    {}
                    <motion.div
                        className="absolute -inset-6 pointer-events-none"
                        animate={{
                            opacity: [0.12, 0.22, 0.12],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        style={{
                            background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.25) 0%, transparent 65%)',
                            filter: 'blur(25px)',
                        }}
                    />

                    {}
                    <motion.div
                        className="relative px-5 pt-5 pb-3 border-b border-white/10"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                    >
                        <div className="flex items-center gap-2.5">
                            <motion.span
                                animate={{
                                    rotate: [0, 12, -12, 0],
                                    scale: [1, 1.15, 1.15, 1],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="text-xl"
                            >
                                ✨
                            </motion.span>
                            <h3 className="text-sm font-bold text-white/95 tracking-wide uppercase">
                                {title}
                            </h3>
                        </div>
                        <p className="text-xs text-white/50 mt-1.5 pl-[30px]">
                            Preview changes before applying
                        </p>
                    </motion.div>

                    {}
                    <motion.div
                        className="relative p-5 min-h-[180px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                    >
                        {children}
                    </motion.div>

                    {}
                    <motion.div
                        className="relative px-5 pb-5 pt-3 flex gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        {}
                        <motion.button
                            onMouseEnter={() => setIsHoveringApply(true)}
                            onMouseLeave={() => setIsHoveringApply(false)}
                            animate={{
                                scale: isHoveringApply && hasChanges ? 1.03 : 1,
                                y: isHoveringApply && hasChanges ? -2 : 0,
                            }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleApplyClick}
                            disabled={!hasChanges}
                            className="relative flex-1 py-3 px-5 rounded-xl text-sm font-bold
                                transition-colors duration-200 flex items-center justify-center gap-2 overflow-hidden"
                            style={{
                                background: hasChanges
                                    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)'
                                    : 'rgba(255, 255, 255, 0.08)',
                                color: hasChanges ? '#fff' : 'rgba(255,255,255,0.35)',
                                boxShadow: hasChanges
                                    ? `0 6px 20px rgba(168, 85, 247, 0.4), 
                                       inset 0 1px 0 rgba(255,255,255,0.25),
                                       ${isHoveringApply ? '0 10px 30px rgba(168, 85, 247, 0.5)' : ''}`
                                    : 'none',
                                cursor: hasChanges ? 'pointer' : 'not-allowed',
                            }}
                        >
                            {}
                            <AnimatePresence>
                                {ripple && (
                                    <motion.span
                                        key={ripple.id}
                                        initial={{ scale: 0, opacity: 0.5 }}
                                        animate={{ scale: 4, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="absolute rounded-full bg-white/30 pointer-events-none"
                                        style={{
                                            left: ripple.x - 10,
                                            top: ripple.y - 10,
                                            width: 20,
                                            height: 20,
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                            <motion.span
                                animate={{ scale: hasChanges ? [1, 1.2, 1] : 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                ✓
                            </motion.span>
                            Apply
                        </motion.button>

                        {}
                        <motion.button
                            onMouseEnter={() => setIsHoveringRevert(true)}
                            onMouseLeave={() => setIsHoveringRevert(false)}
                            animate={{
                                scale: isHoveringRevert ? 1.02 : 1,
                                backgroundColor: isHoveringRevert
                                    ? 'rgba(255,255,255,0.15)'
                                    : 'rgba(255, 255, 255, 0.06)',
                            }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onRevert}
                            className="flex-1 py-3 px-5 rounded-xl text-sm font-semibold
                                transition-all duration-200 flex items-center justify-center gap-2"
                            style={{
                                color: 'rgba(255, 255, 255, 0.75)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                            }}
                        >
                            <motion.span
                                animate={{ rotate: isHoveringRevert ? -30 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                ↩
                            </motion.span>
                            Revert
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PreviewContainer;
