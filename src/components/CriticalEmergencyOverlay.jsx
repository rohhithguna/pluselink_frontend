import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmergencyStore from '../store/emergencyStore';
import useEmergencySiren from '../hooks/useEmergencySiren';


const CriticalEmergencyOverlay = () => {
    const { isEmergencyActive, deactivateEmergency } = useEmergencyStore();

    
    useEmergencySiren();

    return (
        <AnimatePresence>
            {isEmergencyActive && (
                <>
                    {}
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30
                        }}
                        className="emergency-banner"
                    >
                        <span className="emergency-banner-icon">🚨</span>
                        <span>Critical State Active — Respond Now</span>
                        <span className="emergency-banner-icon">🚨</span>

                        {}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={deactivateEmergency}
                            style={{
                                marginLeft: '24px',
                                padding: '6px 16px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: '2px solid rgba(255, 255, 255, 0.5)',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '12px',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                            }}
                        >
                            Deactivate
                        </motion.button>
                    </motion.div>

                    {}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="emergency-overlay"
                    >
                        {}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.8, 1, 0.8]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                            style={{
                                position: 'fixed',
                                top: '80px',
                                left: '20px',
                                fontSize: '32px',
                                zIndex: 9999,
                            }}
                        >
                            ⚠️
                        </motion.div>

                        {}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.8, 1, 0.8]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.5
                            }}
                            style={{
                                position: 'fixed',
                                top: '80px',
                                right: '20px',
                                fontSize: '32px',
                                zIndex: 9999,
                            }}
                        >
                            ⚠️
                        </motion.div>

                        {}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                position: 'fixed',
                                bottom: '30px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(127, 29, 29, 0.95)',
                                backdropFilter: 'blur(10px)',
                                padding: '12px 32px',
                                borderRadius: '50px',
                                border: '2px solid #dc2626',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                zIndex: 9999,
                                boxShadow: '0 0 40px rgba(220, 38, 38, 0.5)',
                            }}
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                }}
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: '#ef4444',
                                    boxShadow: '0 0 20px #ef4444',
                                }}
                            />
                            <span style={{
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '13px',
                                letterSpacing: '1px',
                            }}>
                                EMERGENCY MODE ACTIVE
                            </span>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CriticalEmergencyOverlay;
