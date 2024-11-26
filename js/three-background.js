import * as THREE from 'three';

class ParticleSystem {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('particles-bg'),
            alpha: true
        });
        
        this.particles = [];
        this.lines = [];
        this.init();
    }

    init() {
        this.setupRenderer();
        this.setupCamera();
        this.createParticles();
        this.createLines();
        this.animate();
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('home').appendChild(this.renderer.domElement);
    }

    setupCamera() {
        this.camera.position.z = 30;
    }

    createParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;

            velocities.push({
                x: (Math.random() - 0.5) * 0.05,
                y: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.05
            });
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: 0x00f7ff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particleSystem);
        this.particles = { positions, velocities };
    }

    createLines() {
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x7000ff,
            transparent: true,
            opacity: 0.2
        });

        const lineCount = 50;
        const positions = new Float32Array(lineCount * 6);
        const velocities = [];

        for (let i = 0; i < lineCount; i++) {
            const i6 = i * 6;
            positions[i6] = (Math.random() - 0.5) * 50;
            positions[i6 + 1] = (Math.random() - 0.5) * 50;
            positions[i6 + 2] = (Math.random() - 0.5) * 50;
            positions[i6 + 3] = (Math.random() - 0.5) * 50;
            positions[i6 + 4] = (Math.random() - 0.5) * 50;
            positions[i6 + 5] = (Math.random() - 0.5) * 50;

            velocities.push({
                x1: (Math.random() - 0.5) * 0.03,
                y1: (Math.random() - 0.5) * 0.03,
                z1: (Math.random() - 0.5) * 0.03,
                x2: (Math.random() - 0.5) * 0.03,
                y2: (Math.random() - 0.5) * 0.03,
                z2: (Math.random() - 0.5) * 0.03
            });
        }

        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.lineSystem);
        this.lines = { positions, velocities };
    }

    updateParticles() {
        const positions = this.particles.positions;
        const velocities = this.particles.velocities;

        for (let i = 0; i < positions.length; i += 3) {
            const velocity = velocities[i / 3];

            positions[i] += velocity.x;
            positions[i + 1] += velocity.y;
            positions[i + 2] += velocity.z;

            if (Math.abs(positions[i]) > 25) velocity.x *= -1;
            if (Math.abs(positions[i + 1]) > 25) velocity.y *= -1;
            if (Math.abs(positions[i + 2]) > 25) velocity.z *= -1;
        }

        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    updateLines() {
        const positions = this.lines.positions;
        const velocities = this.lines.velocities;

        for (let i = 0; i < positions.length; i += 6) {
            const velocity = velocities[i / 6];

            positions[i] += velocity.x1;
            positions[i + 1] += velocity.y1;
            positions[i + 2] += velocity.z1;
            positions[i + 3] += velocity.x2;
            positions[i + 4] += velocity.y2;
            positions[i + 5] += velocity.z2;

            if (Math.abs(positions[i]) > 25) velocity.x1 *= -1;
            if (Math.abs(positions[i + 1]) > 25) velocity.y1 *= -1;
            if (Math.abs(positions[i + 2]) > 25) velocity.z1 *= -1;
            if (Math.abs(positions[i + 3]) > 25) velocity.x2 *= -1;
            if (Math.abs(positions[i + 4]) > 25) velocity.y2 *= -1;
            if (Math.abs(positions[i + 5]) > 25) velocity.z2 *= -1;
        }

        this.lineSystem.geometry.attributes.position.needsUpdate = true;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.updateParticles();
        this.updateLines();

        this.particleSystem.rotation.x += 0.001;
        this.particleSystem.rotation.y += 0.001;
        this.lineSystem.rotation.x += 0.001;
        this.lineSystem.rotation.y += 0.001;

        this.renderer.render(this.scene, this.camera);
    }
}

// 初始化粒子系统
window.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});
