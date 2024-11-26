class LightParticlesBackground {
    constructor(options = {}) {
        this.options = {
            particleColor: options.particleColor || 'rgba(255, 255, 255, 0.8)',
            particleSize: options.particleSize || { min: 1, max: 3 },
            particleCount: options.particleCount || 80,
            speed: options.speed || { min: 0.2, max: 0.8 },
            direction: options.direction || { x: 1, y: 1 },
            glowEffect: options.glowEffect || true,
            glowSize: options.glowSize || 15,
            connectParticles: options.connectParticles || false,
            ...options
        };
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationFrame = null;
        this.isRunning = false;
        this.mousePosition = { x: 0, y: 0 };
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.appendChild(this.canvas);
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none';

        // 添加鼠标移动事件监听
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            this.mousePosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        });

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createParticles();
        this.animate();
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * (this.options.particleSize.max - this.options.particleSize.min) + this.options.particleSize.min,
                speedX: (Math.random() - 0.5) * (this.options.speed.max - this.options.speed.min) + this.options.speed.min,
                speedY: (Math.random() - 0.5) * (this.options.speed.max - this.options.speed.min) + this.options.speed.min,
                glow: Math.random() * this.options.glowSize
            });
        }
    }

    drawParticle(particle) {
        // 创建径向渐变
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.glow
        );
        
        const baseColor = this.options.particleColor.replace(')', ', ');
        gradient.addColorStop(0, baseColor + '1)');
        gradient.addColorStop(0.5, baseColor + '0.3)');
        gradient.addColorStop(1, baseColor + '0)');

        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size + particle.glow, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // 添加鼠标交互效果
        const dx = this.mousePosition.x - particle.x;
        const dy = this.mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.x += dx * force * 0.03;
            particle.y += dy * force * 0.03;
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX * this.options.direction.x;
            particle.y += particle.speedY * this.options.direction.y;

            // 边界检查
            if (particle.x < -particle.glow) particle.x = this.canvas.width + particle.glow;
            if (particle.x > this.canvas.width + particle.glow) particle.x = -particle.glow;
            if (particle.y < -particle.glow) particle.y = this.canvas.height + particle.glow;
            if (particle.y > this.canvas.height + particle.glow) particle.y = -particle.glow;

            // 更新光晕大小
            particle.glow = Math.sin(Date.now() * 0.003) * this.options.glowSize + this.options.glowSize;
        });
    }

    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.particles.forEach(particle => this.drawParticle(particle));
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.createParticles();
    }
}
