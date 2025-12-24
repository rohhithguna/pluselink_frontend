import React from 'react';
import { motion } from 'framer-motion';
import BadgeDisplay from './BadgeDisplay';
import '../styles/badge-styles.css';


const BadgeCollection = ({
    badges = [],
    size = 'md',
    showEmpty = true,
    maxDisplay = null,
    title = "Achievements"
}) => {
    
    const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;
    const remainingCount = maxDisplay ? Math.max(0, badges.length - maxDisplay) : 0;

    return (
        <div>
            {title && (
                <h3 style={{
                    fontSize: 16,
                    fontWeight: 600,
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                }}>
                    🏆 {title}
                    {badges.length > 0 && (
                        <span style={{
                            fontSize: 12,
                            fontWeight: 500,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: 12
                        }}>
                            {badges.length}
                        </span>
                    )}
                </h3>
            )}

            {badges.length === 0 && showEmpty ? (
                <div className="badge-empty-state">
                    <div className="badge-empty-state-icon">🎯</div>
                    <p>No badges earned yet</p>
                    <p style={{ fontSize: 12, marginTop: 4 }}>
                        Stay active to earn recognition!
                    </p>
                </div>
            ) : (
                <motion.div
                    className="badge-collection"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                >
                    {displayBadges.map((badge, index) => (
                        <motion.div
                            key={badge.type}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <BadgeDisplay
                                badge={badge}
                                size={size}
                            />
                        </motion.div>
                    ))}

                    {}
                    {remainingCount > 0 && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: size === 'sm' ? 28 : size === 'lg' ? 56 : 40,
                                height: size === 'sm' ? 28 : size === 'lg' ? 56 : 40,
                                borderRadius: '50%',
                                background: 'rgba(107, 114, 128, 0.2)',
                                fontSize: size === 'sm' ? 10 : 12,
                                fontWeight: 600,
                                color: '#6b7280'
                            }}
                        >
                            +{remainingCount}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default BadgeCollection;
