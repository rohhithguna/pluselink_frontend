import React, { useEffect, useRef } from 'react';

const PremiumBackground = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        
        const colors = [
            'rgba(0, 255, 0, 1)',   
        ];

        
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
                this.baseX = this.x;
                this.baseY = this.y;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 5 + 10; 
                this.speedY = Math.random() * 0.3 + 0.1; 
                this.speedX = Math.random() * 0.2 - 0.1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                
                this.baseY += this.speedY;
                this.baseX += this.speedX;

                
                const dx = mouseRef.current.x - this.baseX;
                const dy = mouseRef.current.y - this.baseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    this.x = this.baseX + (dx * force * 0.03);
                    this.y = this.baseY + (dy * force * 0.03);
                } else {
                    this.x = this.baseX;
                    this.y = this.baseY;
                }

                
                if (this.baseY > canvas.height + 10) {
                    this.reset();
                }

                if (this.baseX < -10 || this.baseX > canvas.width + 10) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        
        const particleCount = 60;
        particlesRef.current = Array.from({ length: particleCount }, () => new Particle());

        
        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        };
        window.addEventListener('mousemove', handleMouseMove);

        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ background: 'red', zIndex: -10 }}
        />
    );
};

export default PremiumBackground;
