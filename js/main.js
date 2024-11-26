// 等待页面加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 初始化加载动画
    initLoader();
    // 初始化自定义鼠标
    initCustomCursor();
    // 初始化导航菜单
    initNavigation();
    // 初始化主题切换
    initThemeToggle();
    // 初始化滚动动画
    initScrollAnimations();
    // 初始化技能动画
    initSkillsAnimation();
});

// 加载动画
function initLoader() {
    const loader = document.querySelector('.loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1500);
    });
}

// 自定义鼠标
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    document.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.transform = `translate(${posX}px, ${posY}px)`;
        cursorOutline.style.transform = `translate(${posX - 16}px, ${posY - 16}px)`;
    });

    // 鼠标悬停效果
    document.querySelectorAll('a, button, .card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'scale(1.5)';
            cursorOutline.style.opacity = '0.5';
        });

        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'scale(1)';
            cursorOutline.style.opacity = '1';
        });
    });
}

// 导航菜单
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    // 移动端菜单切换
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // 导航项点击
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // 移除所有活动状态
            navItems.forEach(link => link.classList.remove('active'));
            // 添加当前活动状态
            item.classList.add('active');
            // 如果是移动端，点击后关闭菜单
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // 滚动监听
    window.addEventListener('scroll', () => {
        const fromTop = window.scrollY + 100;

        navItems.forEach(item => {
            const section = document.querySelector(item.hash);
            
            if (
                section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop
            ) {
                navItems.forEach(link => link.classList.remove('active'));
                item.classList.add('active');
            }
        });

        // 导航栏背景透明度
        const nav = document.querySelector('.main-nav');
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(26, 27, 75, 0.95)';
        } else {
            nav.style.background = 'rgba(26, 27, 75, 0.8)';
        }
    });
}

// 主题切换
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const root = document.documentElement;
    let isDark = true;

    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        if (isDark) {
            root.style.setProperty('--bg-color', '#0a0a1f');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.1)');
        } else {
            root.style.setProperty('--bg-color', '#f0f0f0');
            root.style.setProperty('--text-color', '#0a0a1f');
            root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.9)');
        }
        themeToggle.classList.toggle('light-mode');
    });
}

// 滚动动画
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const cards = document.querySelectorAll('.card');
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                if (entry.target.classList.contains('skill-card')) {
                    const levelBar = entry.target.querySelector('.level-bar');
                    if (levelBar) {
                        levelBar.style.width = levelBar.dataset.level + '%';
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
    cards.forEach(card => observer.observe(card));
}

// 技能动画
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.level-bar');
    
    skillBars.forEach(bar => {
        bar.style.width = '0';
        const level = bar.style.width;
        bar.dataset.level = level.replace('%', '');
    });
}

// 3D悬停效果
document.querySelectorAll('.hover-3d').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// 实验室技能展示
function initLabItems() {
    const skills = [
        { name: 'JavaScript', level: 90 },
        { name: 'HTML/CSS', level: 85 },
        { name: 'React', level: 80 },
        { name: 'Node.js', level: 75 },
        { name: 'Python', level: 70 }
    ];

    const labContainer = document.querySelector('.lab-items');
    
    skills.forEach(skill => {
        const labItem = document.createElement('div');
        labItem.className = 'lab-item hover-3d';
        labItem.innerHTML = `
            <h3>${skill.name}</h3>
            <div class="skill-tube">
                <div class="level-bar" data-level="${skill.level}"></div>
            </div>
        `;
        labContainer.appendChild(labItem);
    });
}

// 粒子效果
function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        container.appendChild(particle);
    }
}

// 表单提交处理
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // 这里添加表单提交逻辑
    const formData = new FormData(e.target);
    console.log('Form submitted:', Object.fromEntries(formData));
    // 添加提交成功的动画效果
    const btn = e.target.querySelector('button');
    btn.classList.add('success');
    createParticles(btn.querySelector('.btn-particles'), 20);
});
