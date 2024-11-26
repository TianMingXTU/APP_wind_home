class ThreeBackground {
    constructor(options = {}) {
        this.options = {
            color: options.color || 0x6366f1,
            ...options
        };
    }
    
    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // 创建canvas并添加到容器
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0';
        container.appendChild(this.canvas);

        // 初始化Three.js
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        this.setupScene();
        this.createObjects();
        this.setupLights();
        this.addEventListeners();
        this.animate();
    }
    
    setupScene() {
        const container = this.canvas.parentElement;
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.camera.position.z = 30;
        
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.targetRotation = new THREE.Vector2();
        
        this.geometryGroup = new THREE.Group();
        this.scene.add(this.geometryGroup);
    }
    
    createObjects() {
        const geometries = [
            new THREE.IcosahedronGeometry(2, 0),
            new THREE.OctahedronGeometry(2, 0),
            new THREE.TetrahedronGeometry(2, 0)
        ];
        
        const material = new THREE.MeshPhongMaterial({
            color: this.options.color,
            shininess: 100,
            transparent: true,
            opacity: 0.8,
            wireframe: false
        });

        for (let i = 0; i < 5; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.x = (Math.random() - 0.5) * 20;
            mesh.position.y = (Math.random() - 0.5) * 20;
            mesh.position.z = (Math.random() - 0.5) * 20;
            
            this.geometryGroup.add(mesh);
        }
    }
    
    setupLights() {
        // 主光源
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(0, 1, 1);
        this.scene.add(mainLight);
        
        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // 点光源
        const pointLight1 = new THREE.PointLight(0x6366f1, 1, 50);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x10b981, 1, 50);
        pointLight2.position.set(-10, -10, -10);
        this.scene.add(pointLight2);
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('themechange', (e) => this.onThemeChange(e));
    }
    
    onWindowResize() {
        const container = this.canvas.parentElement;
        this.camera.aspect = container.offsetWidth / container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
    
    onMouseMove(event) {
        const container = this.canvas.parentElement;
        this.mouse.x = (event.clientX / container.offsetWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / container.offsetHeight) * 2 + 1;
        
        this.targetRotation.x = this.mouse.y * 0.5;
        this.targetRotation.y = this.mouse.x * 0.5;
    }
    
    onThemeChange(event) {
        const isDark = event.detail.theme === 'dark';
        this.updateTheme(isDark);
    }
    
    updateTheme(isDark) {
        const color = isDark ? 0x818cf8 : 0x6366f1;
        this.geometryGroup.children.forEach(mesh => {
            mesh.material.color.setHex(color);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = this.clock.getElapsedTime();
        
        // 平滑相机旋转
        this.geometryGroup.rotation.x += (this.targetRotation.x - this.geometryGroup.rotation.x) * 0.05;
        this.geometryGroup.rotation.y += (this.targetRotation.y - this.geometryGroup.rotation.y) * 0.05;
        
        // 更新每个几何体
        this.geometryGroup.children.forEach(mesh => {
            // 自转
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
            mesh.rotation.z += 0.01;
            
            // 浮动动画
            const floatY = Math.sin(time + mesh.position.x) * 0.01;
            mesh.position.y += floatY;
            
            // 脉冲缩放
            const scale = 1 + Math.sin(time * 2 + mesh.position.x) * 0.1;
            mesh.scale.set(scale, scale, scale);
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// 当页面加载完成后初始化
window.addEventListener('load', () => {
    const threeBackground = new ThreeBackground();
    threeBackground.init('bg-container');
});
