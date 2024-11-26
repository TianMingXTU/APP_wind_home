class ParticlesBackground {
    constructor(options = {}) {
        this.options = {
            particleColor: options.particleColor || '#ffffff',
            particleSize: options.particleSize || 2,
            particleCount: options.particleCount || 100,
            particleSpeed: options.particleSpeed || 1,
            lineColor: options.lineColor || 'rgba(255,255,255,0.1)',
            lineLength: options.lineLength || 150,
            particleLife: options.particleLife || 3,
            ...options
        };
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationFrame = null;
        this.isRunning = false;
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
                vx: (Math.random() - 0.5) * this.options.particleSpeed,
                vy: (Math.random() - 0.5) * this.options.particleSpeed,
                size: Math.random() * this.options.particleSize,
                life: Math.random() * this.options.particleLife,
                maxLife: this.options.particleLife
            });
        }
    }

    drawParticle(particle) {
        const opacity = particle.life / particle.maxLife;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${this.hexToRgb(this.options.particleColor).join(',')},${opacity})`;
        this.ctx.fill();
    }

    drawLines() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.options.lineLength) {
                    const opacity = (1 - distance / this.options.lineLength) * 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = this.options.lineColor.replace(')', `,${opacity})`);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.01;

            if (p.x < 0 || p.x > this.canvas.width || 
                p.y < 0 || p.y > this.canvas.height || 
                p.life <= 0) {
                this.particles[i] = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * this.options.particleSpeed,
                    vy: (Math.random() - 0.5) * this.options.particleSpeed,
                    size: Math.random() * this.options.particleSize,
                    life: this.options.particleLife,
                    maxLife: this.options.particleLife
                };
            }
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [255, 255, 255];
    }

    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.particles.forEach(p => this.drawParticle(p));
        this.drawLines();
        
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
