import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useSettingsStore from '../store/settingsStore';


const PHYSICS_MULTIPLIERS = {
    off: 0,
    soft: 0.3,
    medium: 0.6,
    strong: 1,
};

const AmbientMotion = () => {
    const containerRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef(null);
    const location = useLocation();

    
    const { cursorGravity, parallaxBackground, physicsStrength } = useSettingsStore();
    const physicsMultiplier = useMemo(() => PHYSICS_MULTIPLIERS[physicsStrength] || 0.6, [physicsStrength]);

    
    const [currentTheme, setCurrentTheme] = useState(() =>
        localStorage.getItem('welcome_theme') || 'default'
    );

    
    useEffect(() => {
        const handleStorageChange = () => {
            const newTheme = localStorage.getItem('welcome_theme') || 'default';
            setCurrentTheme(newTheme);
        };

        
        window.addEventListener('storage', handleStorageChange);

        
        const interval = setInterval(handleStorageChange, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        
        if (!parallaxBackground) return;

        
        const isWelcomeOrLogin = location.pathname === '/' || location.pathname === '/login';
        const isWelcomePage = location.pathname === '/';

        

        
        const interactiveCount = isWelcomeOrLogin ? 80 : 30;
        const staticCount = isWelcomeOrLogin ? 120 : 50;  
        const speedMultiplier = isWelcomeOrLogin ? 1 : 0.4;
        const particleSize = isWelcomeOrLogin ? { min: 1.5, max: 2.5 } : { min: 1.5, max: 2.5 }; 

        
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 0.05 * speedMultiplier;
                this.vy = (Math.random() - 0.5) * 0.05 * speedMultiplier;
                this.mass = 0.8 + Math.random() * 0.4;
                this.size = particleSize.min + Math.random() * (particleSize.max - particleSize.min);
                this.opacity = 0.8 + Math.random() * 0.2; 
                this.element = null;
            }

            applyForce(fx, fy) {
                this.vx += fx / this.mass;
                this.vy += fy / this.mass;
            }

            update(mouseX, mouseY, width, height, gravityEnabled, pMultiplier) {
                
                if (gravityEnabled && pMultiplier > 0) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > 0 && distance < 400) {
                        const angle = Math.atan2(dy, dx);

                        if (distance < 180) {
                            
                            const repelForce = (180 - distance) / (distance * distance * 0.02) * pMultiplier;
                            this.applyForce(-Math.cos(angle) * repelForce * 0.3, -Math.sin(angle) * repelForce * 0.3);
                        } else {
                            const attractForce = (distance - 180) * 0.0009 * pMultiplier;
                            this.applyForce(Math.cos(angle) * attractForce, Math.sin(angle) * attractForce);
                        }
                    }
                }

                this.applyForce(0, 0.008);
                this.vx *= 0.96;
                this.vy *= 0.96;

                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) {
                    this.x = 0;
                    this.vx *= -0.5;
                } else if (this.x > width) {
                    this.x = width;
                    this.vx *= -0.5;
                }

                if (this.y < 0) {
                    this.y = 0;
                    this.vy *= -0.5;
                } else if (this.y > height) {
                    this.y = height;
                    this.vy *= -0.5;
                }
            }

            render() {
                if (this.element) {
                    this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
                }
            }
        }

        
        const themeColors = {
            default: [
                { r: 168, g: 85, b: 247 },   
                { r: 147, g: 51, b: 234 },   
                { r: 139, g: 92, b: 246 },   
                { r: 124, g: 58, b: 237 },   
                { r: 99, g: 102, b: 241 },   
                { r: 192, g: 132, b: 252 },  
            ],
            aurora: [
                { r: 34, g: 211, b: 238 },   
                { r: 6, g: 182, b: 212 },    
                { r: 244, g: 114, b: 182 },  
                { r: 168, g: 85, b: 247 },   
                { r: 99, g: 102, b: 241 },   
                { r: 14, g: 165, b: 233 },   
            ],
            serenity: [
                { r: 5, g: 150, b: 105 },    
                { r: 16, g: 185, b: 129 },   
                { r: 52, g: 211, b: 153 },   
                { r: 110, g: 231, b: 183 },  
                { r: 45, g: 212, b: 191 },   
                { r: 20, g: 184, b: 166 },   
            ],
            cyber: [
                { r: 255, g: 107, b: 157 },  
                { r: 199, g: 125, b: 255 },  
                { r: 255, g: 181, b: 107 },  
                { r: 254, g: 74, b: 126 },   
                { r: 0, g: 212, b: 255 },    
                { r: 161, g: 54, b: 112 },   
            ],
            royal: [
                { r: 212, g: 175, b: 55 },   
                { r: 201, g: 162, b: 39 },   
                { r: 255, g: 215, b: 0 },    
                { r: 218, g: 165, b: 32 },   
                { r: 255, g: 193, b: 37 },   
                { r: 184, g: 134, b: 11 },   
            ],
            festival: [
                { r: 249, g: 115, b: 22 },   
                { r: 244, g: 114, b: 182 },  
                { r: 192, g: 132, b: 252 },  
                { r: 96, g: 165, b: 250 },   
                { r: 52, g: 211, b: 153 },   
                { r: 251, g: 191, b: 36 },   
            ],
        };

        
        const colors = isWelcomePage ? (themeColors[currentTheme] || themeColors.default) : themeColors.default;

        
        const particles = [];
        const particleElements = [];

        
        for (let i = 0; i < interactiveCount; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const particle = new Particle(x, y);
            particle.interactive = true;

            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.color = color;
            particle.size = particleSize.min + Math.random() * (particleSize.max - particleSize.min);

            const el = document.createElement('div');
            el.className = 'ambient-particle';
            el.style.cssText = `
                position: fixed;
                width: ${particle.size}px;
                height: ${particle.size}px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity}) 0%, rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity * 0.8}) 50%, transparent 100%);
                box-shadow: 0 0 ${particle.size * 2}px rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity * 0.6});
                pointer-events: none;
                will-change: transform;
                z-index: 1;
            `;
            container.appendChild(el);
            particle.element = el;
            particleElements.push(el);
            particles.push(particle);
        }

        
        for (let i = 0; i < staticCount; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const particle = new Particle(x, y);
            particle.interactive = false;
            particle.vx = (Math.random() - 0.5) * 0.02 * speedMultiplier;
            particle.vy = (Math.random() - 0.5) * 0.02 * speedMultiplier;

            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.color = color;
            particle.size = particleSize.min + Math.random() * (particleSize.max - particleSize.min);
            particle.opacity = 0.6 + Math.random() * 0.3; 

            const el = document.createElement('div');
            el.className = 'ambient-particle-static';
            el.style.cssText = `
                position: fixed;
                width: ${particle.size}px;
                height: ${particle.size}px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity}) 0%, rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity * 0.7}) 50%, transparent 100%);
                box-shadow: 0 0 ${particle.size * 2}px rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity * 0.6});
                pointer-events: none;
                will-change: transform;
                z-index: 1;
            `;
            container.appendChild(el);
            particle.element = el;
            particleElements.push(el);
            particles.push(particle);
        }

        particlesRef.current = particles;

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        let lastFrame = 0;
        const FPS = 30;
        const frameInterval = 1000 / FPS;

        const animate = (timestamp) => {
            if (timestamp - lastFrame >= frameInterval) {
                lastFrame = timestamp - ((timestamp - lastFrame) % frameInterval);

                const { x: mouseX, y: mouseY } = mouseRef.current;
                const width = window.innerWidth;
                const height = window.innerHeight;

                particles.forEach(particle => {
                    if (particle.interactive) {
                        particle.update(mouseX, mouseY, width, height, cursorGravity, physicsMultiplier);
                    } else {
                        particle.x += particle.vx;
                        particle.y += particle.vy;

                        if (particle.x < 0) particle.x = width;
                        if (particle.x > width) particle.x = 0;
                        if (particle.y < 0) particle.y = height;
                        if (particle.y > height) particle.y = 0;
                    }
                    particle.render();
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            particleElements.forEach(el => el.remove());
        };
    }, [location.pathname, currentTheme, parallaxBackground, cursorGravity, physicsMultiplier]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
        />
    );
};

export default AmbientMotion;
