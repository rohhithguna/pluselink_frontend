import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/badge-styles.css';


const BadgeDisplay = ({
    badge,
    size = 'md',
    showTooltip = true,
    inline = false
}) => {
    const [isHovered, setIsHovered] = useState(false);

    if (!badge) return null;

    
    const typeClass = `badge-${badge.type.replace('_', '-')}`;

    return (
        <motion.div
            className={`badge-container ${inline ? 'badge-inline' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <div
                className={`badge badge-${size} ${typeClass} ${badge.is_new ? 'badge-new' : ''}`}
                title={!showTooltip ? badge.name : undefined}
            >
                {badge.icon}

                {}
                {badge.is_new && (
                    <div className="badge-new-indicator" />
                )}
            </div>

            {}
            {showTooltip && (
                <div className="badge-tooltip">
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>
                        {badge.icon} {badge.name}
                    </div>
                    <div style={{ opacity: 0.8, fontSize: 11 }}>
                        {badge.description}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default BadgeDisplay;
