
import React from 'react';
import { motion } from 'framer-motion';


const CrownIcon = ({ size = 16, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`role-icon ${className}`}
    >
        <path d="M2 20h20" />
        <path d="M4 20l2-14 4 6 2-8 2 8 4-6 2 14" />
        <circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none" />
    </svg>
);


const ShieldIcon = ({ size = 16, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`role-icon ${className}`}
    >
        <path d="M12 2L3 7v6c0 5.25 3.75 9.74 9 11 5.25-1.26 9-5.75 9-11V7l-9-5z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);


const PenNibIcon = ({ size = 16, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`role-icon ${className}`}
    >
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
    </svg>
);


const BookIcon = ({ size = 16, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`role-icon ${className}`}
    >
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <path d="M8 7h8M8 11h6" />
    </svg>
);


const roleIcons = {
    super_admin: CrownIcon,
    college_admin: ShieldIcon,
    faculty: PenNibIcon,
    student: BookIcon,
};


const roleLabels = {
    super_admin: 'Super Admin',
    college_admin: 'Admin',
    faculty: 'Faculty',
    student: 'Student',
};


const RoleIcon = ({ role, size = 16, className = '', animate = true }) => {
    const IconComponent = roleIcons[role] || BookIcon;
    const label = roleLabels[role] || 'User';

    if (animate) {
        return (
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                title={label}
                aria-label={label}
            >
                <IconComponent size={size} className={className} />
            </motion.div>
        );
    }

    return (
        <div title={label} aria-label={label}>
            <IconComponent size={size} className={className} />
        </div>
    );
};


export { CrownIcon, ShieldIcon, PenNibIcon, BookIcon };
export default RoleIcon;
