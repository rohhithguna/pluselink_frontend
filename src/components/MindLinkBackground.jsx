import React from 'react';

const MindLinkBackground = () => {
    return (
        <>
            {}
            <div
                className="fixed inset-0 pointer-events-none z-[-1]"
                style={{
                    backgroundImage: `
                        radial-gradient(circle, rgba(139, 92, 246, 0.15) 1px, transparent 1px),
                        radial-gradient(circle, rgba(167, 139, 250, 0.12) 0.8px, transparent 0.8px),
                        radial-gradient(circle, rgba(196, 181, 253, 0.1) 1.2px, transparent 1.2px)
                    `,
                    backgroundSize: '80px 80px, 120px 120px, 100px 100px',
                    backgroundPosition: '0 0, 40px 40px, 20px 60px',
                    opacity: 0.6,
                    animation: 'mindlinkDots 80s linear infinite'
                }}
            />

            {}
            <div
                className="fixed inset-0 pointer-events-none z-[-2]"
                style={{
                    background: `
                        radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(167, 139, 250, 0.06) 0%, transparent 50%),
                        linear-gradient(180deg, #faf5ff 0%, #f5f3ff 50%, #ede9fe 100%)
                    `
                }}
            />

            <style>{`
                @keyframes mindlinkDots {
                    0% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(40px, 40px);
                    }
                }
            `}</style>
        </>
    );
};

export default MindLinkBackground;
