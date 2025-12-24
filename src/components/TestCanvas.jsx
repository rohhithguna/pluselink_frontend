import React, { useEffect, useRef } from 'react';

const TestCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error('[TestCanvas] Canvas ref is null!');
            return;
        }

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
        ctx.fill();

        }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -10,
                pointerEvents: 'none'
            }}
        />
    );
};

export default TestCanvas;
