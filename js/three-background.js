class ThreeBackground {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('bg-canvas'),
            antialias: true,
            alpha: true
        });
        
        this.init();
        this.createObjects();
        this.setupLights();
        this.addEventListeners();
        this.animate();
    }
    
    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.camera.position.z = 30;
        
        // 创建时钟用于动画
        this.clock = new THREE.Clock();
        
        // 鼠标位置
        this.mouse = new THREE.Vector2();
        this.targetRotation = new THREE.Vector2();
        
        // 几何体组
        this.geometryGroup = new THREE.Group();
        this.scene.add(this.geometryGroup);
    }
    
    createObjects() {
        // 创建多个几何体
        const geometries = [
            new THREE.IcosahedronGeometry(2, 0),
            new THREE.OctahedronGeometry(2, 0),
            new THREE.TetrahedronGeometry(2, 0)
        ];
        
        const materials = [
            new THREE.MeshPhongMaterial({
                color: 0x6366f1,
                shininess: 100,
                transparent: true,
                opacity: 0.8,
                wireframe: false
            }),
            new THREE.MeshPhongMaterial({
                color: 0x10b981,
                shininess: 100,
                transparent: true,
                opacity: 0.8,
                wireframe: false
            }),
            new THREE.MeshPhongMaterial({
                color: 0xf59e0b,
                shininess: 100,
                transparent: true,
                opacity: 0.8,
                wireframe: false
            })
        ];
        
        // 创建多个几何体实例并随机分布
        for (let i = 0; i < 15; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)].clone();
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // 随机位置
            mesh.position.x = (Math.random() - 0.5) * 40;
            mesh.position.y = (Math.random() - 0.5) * 40;
            mesh.position.z = (Math.random() - 0.5) * 20;
            
            // 随机旋转
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            // 随机缩放
            const scale = 0.5 + Math.random() * 0.5;
            mesh.scale.set(scale, scale, scale);
            
            // 添加到组中
            this.geometryGroup.add(mesh);
            
            // 添加自定义属性用于动画
            mesh.userData.rotationSpeed = {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            };
            
            mesh.userData.floatSpeed = 0.001 + Math.random() * 0.002;
            mesh.userData.floatOffset = Math.random() * Math.PI * 2;
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
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.targetRotation.x = this.mouse.y * 0.5;
        this.targetRotation.y = this.mouse.x * 0.5;
    }
    
    onThemeChange(event) {
        const isDark = event.detail.theme === 'dark';
        
        // 更新材质颜色和不透明度
        this.geometryGroup.children.forEach(mesh => {
            mesh.material.opacity = isDark ? 0.8 : 0.6;
            
            // 在暗色主题下增加发光效果
            if (isDark) {
                mesh.material.emissive = new THREE.Color(0x222222);
            } else {
                mesh.material.emissive = new THREE.Color(0x000000);
            }
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
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;
            
            // 浮动动画
            const floatY = Math.sin(time + mesh.userData.floatOffset) * mesh.userData.floatSpeed;
            mesh.position.y += floatY;
            
            // 脉冲缩放
            const scale = 1 + Math.sin(time * 2 + mesh.userData.floatOffset) * 0.1;
            mesh.scale.set(scale, scale, scale);
            
            // 颜色过渡
            const hue = (time * 0.1 + mesh.userData.floatOffset) % 1;
            mesh.material.color.setHSL(hue, 0.5, 0.5);
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// 当页面加载完成后初始化
window.addEventListener('load', () => {
    window.threeBackground = new ThreeBackground();
});
