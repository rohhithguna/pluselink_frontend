import { useEffect, useRef } from 'react';

const AmbientParticles = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef(null);
    const ripplesRef = useRef([]);
    const auroraTimeRef = useRef(0);
    const vortexCentersRef = useRef([]);
    const focusPointsRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        
        const colors = [
            'rgb(59, 130, 246)',    
            'rgb(99, 102, 241)',    
            'rgb(139, 92, 246)',    
            'rgb(147, 51, 234)',    
            'rgb(168, 85, 247)',    
            'rgb(124, 58, 237)',    
            'rgb(109, 40, 217)',    
            'rgb(67, 56, 202)',     
        ];

        
        focusPointsRef.current = [
            { x: canvas.width * 0.3, y: canvas.height * 0.3, strength: 0.5 },
            { x: canvas.width * 0.7, y: canvas.height * 0.7, strength: 0.5 }
        ];

        
        vortexCentersRef.current = [
            { x: canvas.width * 0.5, y: canvas.height * 0.5, angle: 0, speed: 0.01 }
        ];

        
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.pulsePhase = Math.random() * Math.PI * 2;
                this.baseColor = colors[Math.floor(Math.random() * colors.length)];
                this.currentColor = this.baseColor;
                this.depth = Math.random(); 
                this.twinklePhase = Math.random() * Math.PI * 2;
                this.twinkleSpeed = 0.02 + Math.random() * 0.03;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height; 
                this.baseX = this.x;
                this.baseY = this.y;
                this.depth = Math.random();
                this.baseSize = (0.8 + Math.random() * 0.5) * (0.5 + this.depth * 0.5); 
                this.size = this.baseSize;
                const depthSpeed = 0.5 + this.depth * 0.5; 
                this.speedY = (Math.random() * 0.18 + 0.06) * depthSpeed;
                this.speedX = (Math.random() - 0.5) * 0.1 * depthSpeed;
                this.baseColor = colors[Math.floor(Math.random() * colors.length)];
                this.currentColor = this.baseColor;
            }

            update() {
                
                this.baseY += this.speedY;
                this.baseX += this.speedX;

                
                const waveOffset = Math.sin(this.baseY * 0.01 + auroraTimeRef.current * 0.5) * 10;
                this.baseX += waveOffset * 0.02;

                
                this.pulsePhase += 0.02;
                const pulseScale = 1 + Math.sin(this.pulsePhase) * 0.15;

                
                this.twinklePhase += this.twinkleSpeed;
                const twinkleBrightness = 0.7 + Math.sin(this.twinklePhase) * 0.3;

                
                const dx = mouseRef.current.x - this.baseX;
                const dy = mouseRef.current.y - this.baseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 250; 

                if (distance < maxDistance && distance > 0) {
                    const force = (maxDistance - distance) / maxDistance;
                    const attractForce = force * 40; 
                    this.x = this.baseX + (dx / distance) * attractForce;
                    this.y = this.baseY + (dy / distance) * attractForce;
                    const colorIntensity = force;
                    this.currentColor = this.interpolateColor(this.baseColor, 'rgb(255, 255, 255)', colorIntensity * 0.5);
                } else {
                    this.x = this.baseX;
                    this.y = this.baseY;
                    this.currentColor = this.baseColor;
                }

                
                this.brightness = twinkleBrightness;

                
                if (this.baseY > canvas.height + 10) this.reset();
                if (this.baseX < -10 || this.baseX > canvas.width + 10) this.reset();
            }

            interpolateColor(color1, color2, factor) {
                const c1 = color1.match(/\d+/g).map(Number);
                const c2 = color2.match(/\d+/g).map(Number);
                const r = Math.round(c1[0] + (c2[0] - c1[0]) * factor);
                const g = Math.round(c1[1] + (c2[1] - c1[1]) * factor);
                const b = Math.round(c1[2] + (c2[2] - c1[2]) * factor);
                return `rgb(${r}, ${g}, ${b})`;
            }

            draw() {
                
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.baseSize * 2);

                
                const rgb = this.currentColor.match(/\d+/g).map(Number);

                
                gradient.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`);
                gradient.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);

                
                const glowSize = this.baseSize * 3 * this.brightness; 
                ctx.shadowBlur = glowSize;
                ctx.shadowColor = this.currentColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.baseSize * 1.2, 0, Math.PI * 2); 
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        
        const particleCount = 120;
        particlesRef.current = Array.from({ length: particleCount }, () => new Particle());

        
        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        
        const autoRippleInterval = setInterval(() => {
            ripplesRef.current.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 0,
                strength: 1
            });
        }, 3000);

        
        const vortexInterval = setInterval(() => {
            vortexCentersRef.current.forEach(vortex => {
                vortex.angle += vortex.speed;
            });
        }, 16);

        
        let lastFrameTime = 0;
        const targetFPS = 30; 
        const frameInterval = 1000 / targetFPS;

        const animate = (currentTime) => {
            const deltaTime = currentTime - lastFrameTime;

            if (deltaTime >= frameInterval) {
                lastFrameTime = currentTime - (deltaTime % frameInterval);

                
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                
                particlesRef.current.sort((a, b) => a.depth - b.depth);
                particlesRef.current.forEach(particle => {
                    particle.update();
                    particle.draw();
                });

                
                ripplesRef.current = ripplesRef.current.filter(ripple => {
                    ripple.radius += 3;
                    ripple.strength *= 0.97;
                    return ripple.radius < 300 && ripple.strength > 0.01;
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate(0);

        
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(autoRippleInterval);
            clearInterval(vortexInterval);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
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
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
};

export default AmbientParticles;
