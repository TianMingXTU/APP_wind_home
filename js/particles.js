class ParticleSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.isAnimating = false;
        
        // 默认配置
        this.options = {
            particleCount: options.particleCount || 100,
            particleSize: options.particleSize || { min: 1, max: 3 },
            speed: options.speed || { min: 0.1, max: 0.5 },
            color: options.color || '#ffffff',
            opacity: options.opacity || { min: 0.1, max: 0.5 },
            connectParticles: options.connectParticles !== undefined ? options.connectParticles : true,
            connectDistance: options.connectDistance || 100
        };
        
        this.init();
        this.bindEvents();
    }
    
    init() {
        // 设置canvas尺寸
        this.setCanvasSize();
        
        // 创建粒子
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    setCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: this.random(this.options.particleSize.min, this.options.particleSize.max),
            speed: this.random(this.options.speed.min, this.options.speed.max),
            directionX: Math.random() * 2 - 1,
            directionY: Math.random() * 2 - 1,
            opacity: this.random(this.options.opacity.min, this.options.opacity.max)
        };
    }
    
    random(min, max) {
        return min + Math.random() * (max - min);
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.setCanvasSize());
        
        // 鼠标交互
        let mousePosition = { x: null, y: null };
        this.canvas.addEventListener('mousemove', (e) => {
            mousePosition.x = e.clientX;
            mousePosition.y = e.clientY;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            mousePosition.x = null;
            mousePosition.y = null;
        });
    }
    
    start() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.animate();
        }
    }
    
    stop() {
        this.isAnimating = false;
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        this.particles.forEach((particle, index) => {
            // 更新位置
            particle.x += particle.directionX * particle.speed;
            particle.y += particle.directionY * particle.speed;
            
            // 边界检查
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.directionX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.directionY *= -1;
            }
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${this.hexToRgb(this.options.color).join(',')},${particle.opacity})`;
            this.ctx.fill();
            
            // 连接粒子
            if (this.options.connectParticles) {
                this.connectParticles(particle, index);
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    connectParticles(particle, index) {
        for (let i = index + 1; i < this.particles.length; i++) {
            const particle2 = this.particles[i];
            const dx = particle.x - particle2.x;
            const dy = particle.y - particle2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.options.connectDistance) {
                const opacity = 1 - (distance / this.options.connectDistance);
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(${this.hexToRgb(this.options.color).join(',')},${opacity * 0.5})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(particle2.x, particle2.y);
                this.ctx.stroke();
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
    
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.particles = [];
        this.init();
    }
}

// 导出粒子系统
window.ParticleSystem = ParticleSystem;
