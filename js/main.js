// 使用立即执行函数表达式(IIFE)避免全局作用域污染
(() => {
    'use strict';

    // 工具函数
    const utils = {
        // 防抖函数
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // 节流函数
        throttle(func, limit) {
            let inThrottle;
            return function executedFunction(...args) {
                if (!inThrottle) {
                    func(...args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // 错误处理
        handleError(error, context) {
            console.error(`Error in ${context}:`, error);
            // 可以添加错误上报逻辑
        }
    };

    // 主题管理
    const themeManager = {
        init() {
            this.themeToggle = document.querySelector('.theme-toggle');
            this.body = document.body;
            
            // 检查本地存储的主题
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                this.body.dataset.theme = savedTheme;
                this.updateThemeIcon(savedTheme);
            } else {
                // 检查系统主题偏好
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.body.dataset.theme = prefersDark ? 'dark' : 'light';
                this.updateThemeIcon(prefersDark ? 'dark' : 'light');
            }
            
            // 监听主题切换
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            
            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem('theme')) {
                    this.body.dataset.theme = e.matches ? 'dark' : 'light';
                    this.updateThemeIcon(e.matches ? 'dark' : 'light');
                }
            });
        },
        
        toggleTheme() {
            const currentTheme = this.body.dataset.theme;
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            this.body.dataset.theme = newTheme;
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
            
            // 通知其他组件主题已更改
            window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
        },
        
        updateThemeIcon(theme) {
            const moonIcon = this.themeToggle.querySelector('.fa-moon');
            const sunIcon = this.themeToggle.querySelector('.fa-sun');
            
            if (theme === 'dark') {
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'block';
            } else {
                moonIcon.style.display = 'block';
                sunIcon.style.display = 'none';
            }
        }
    };

    // 滚动进度条
    const scrollProgress = {
        init() {
            this.progressBar = document.querySelector('.scroll-progress');
            window.addEventListener('scroll', () => this.updateProgress());
        },
        
        updateProgress() {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            this.progressBar.style.transform = `scaleX(${scrolled / 100})`;
        }
    };

    // 页面动画
    const pageAnimations = {
        init() {
            this.initIntersectionObserver();
            this.initParallaxEffect();
            this.initTypingEffect();
            this.initScrollIndicator();
        },
        
        initIntersectionObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        },
        
        initParallaxEffect() {
            document.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                
                const moveX = (clientX - centerX) / centerX;
                const moveY = (clientY - centerY) / centerY;
                
                document.querySelectorAll('[data-speed]').forEach(layer => {
                    const speed = layer.dataset.speed;
                    const x = moveX * speed;
                    const y = moveY * speed;
                    layer.style.transform = `translate(${x}px, ${y}px)`;
                });
            });
        },
        
        initTypingEffect() {
            const text = "创新 • 专业 • 高效";
            const typingText = document.querySelector('.typing-text');
            let i = 0;
            
            function type() {
                if (i < text.length) {
                    typingText.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 100);
                }
            }
            
            setTimeout(type, 1000);
        },
        
        initScrollIndicator() {
            const indicator = document.querySelector('.scroll-indicator');
            if (!indicator) return;
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    indicator.style.opacity = '0';
                } else {
                    indicator.style.opacity = '1';
                }
            });
        }
    };

    // 表单验证和动画
    const contactForm = {
        init() {
            this.form = document.getElementById('contact-form');
            if (!this.form) return;
            
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.initInputAnimations();
        },
        
        initInputAnimations() {
            const inputs = this.form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentElement.classList.remove('focused');
                    }
                });
            });
        },
        
        async handleSubmit(e) {
            e.preventDefault();
            
            const submitBtn = this.form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            try {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                // 模拟API调用
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // 成功动画
                submitBtn.innerHTML = '<i class="fas fa-check"></i>';
                this.form.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                }, 2000);
                
            } catch (error) {
                submitBtn.innerHTML = '<i class="fas fa-times"></i>';
                console.error('提交失败:', error);
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                }, 2000);
            }
        }
    };

    // 3D卡片效果
    const card3DEffect = {
        init() {
            document.querySelectorAll('.hover-3d').forEach(card => {
                card.addEventListener('mousemove', (e) => this.handleHover(e, card));
                card.addEventListener('mouseleave', () => this.resetCard(card));
            });
        },
        
        handleHover(e, card) {
            const { offsetWidth: width, offsetHeight: height } = card;
            const { layerX, layerY } = e;
            
            const xRotation = ((layerY - height / 2) / height) * 20;
            const yRotation = ((layerX - width / 2) / width) * 20;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${xRotation}deg)
                rotateY(${yRotation}deg)
                scale3d(1.05, 1.05, 1.05)
            `;
        },
        
        resetCard(card) {
            card.style.transform = `
                perspective(1000px)
                rotateX(0)
                rotateY(0)
                scale3d(1, 1, 1)
            `;
        }
    };

    // 页面加载动画
    const pageLoader = {
        init() {
            window.addEventListener('load', () => {
                document.body.classList.remove('loading');
                document.querySelector('.preloader').style.display = 'none';
                this.animateHeroSection();
            });
        },
        
        animateHeroSection() {
            const tl = gsap.timeline();
            
            tl.from('.hero-text h1', {
                duration: 1,
                y: 100,
                opacity: 0,
                ease: 'power4.out'
            })
            .from('.hero-description span', {
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.cta-buttons a', {
                duration: 0.6,
                y: 30,
                opacity: 0,
                stagger: 0.2,
                ease: 'power2.out'
            }, '-=0.4')
            .from('.floating-elements > div', {
                duration: 1,
                scale: 0,
                opacity: 0,
                stagger: 0.2,
                ease: 'elastic.out(1, 0.5)'
            }, '-=0.6');
        }
    };

    // 导航栏效果
    const navbar = {
        init() {
            this.nav = document.querySelector('.navbar');
            this.mobileMenu = document.querySelector('.mobile-menu');
            this.navLinks = document.querySelector('.nav-links');
            
            window.addEventListener('scroll', () => this.handleScroll());
            if (this.mobileMenu) {
                this.mobileMenu.addEventListener('click', () => this.toggleMobileMenu());
            }
        },
        
        handleScroll() {
            if (window.scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        },
        
        toggleMobileMenu() {
            this.navLinks.classList.toggle('active');
            this.mobileMenu.classList.toggle('active');
        }
    };

    // 背景效果管理
    const BackgroundManager = {
        instances: {},
        
        init() {
            // 只在首页初始化3D背景
            const heroSection = document.querySelector('#hero');
            if (heroSection) {
                const threeBackground = new ThreeBackground({
                    color: document.body.dataset.theme === 'dark' ? '#1a1a1a' : '#ffffff'
                });
                threeBackground.init('hero');
                this.instances.hero = threeBackground;
            }

            // 为其他所有section添加光粒子效果
            const sections = document.querySelectorAll('section:not(#hero)');
            sections.forEach(section => {
                if (!section.classList.contains('no-particles')) {
                    const lightParticles = new LightParticlesBackground({
                        particleColor: document.body.dataset.theme === 'dark' 
                            ? 'rgba(255, 255, 255, 0.8)' 
                            : 'rgba(99, 102, 241, 0.8)',
                        particleSize: { min: 1, max: 3 },
                        particleCount: 50,
                        speed: { min: 0.1, max: 0.3 },
                        glowEffect: true,
                        glowSize: 15,
                        direction: { x: 1, y: 1 }
                    });
                    
                    // 确保section有ID
                    const id = section.id || `particles-${Math.random().toString(36).substr(2, 9)}`;
                    section.id = id;
                    
                    // 初始化光粒子效果
                    lightParticles.init(id);
                    lightParticles.start();
                    this.instances[id] = lightParticles;
                }
            });

            // 监听主题变化
            document.addEventListener('themeChange', (e) => {
                const isDark = e.detail.theme === 'dark';
                this.updateAllBackgrounds(isDark);
            });
        },

        updateAllBackgrounds(isDark) {
            // 更新3D背景（仅首页）
            if (this.instances.hero) {
                this.instances.hero.updateTheme(isDark);
            }

            // 更新所有光粒子效果
            Object.entries(this.instances).forEach(([id, instance]) => {
                if (id !== 'hero' && instance instanceof LightParticlesBackground) {
                    instance.updateOptions({
                        particleColor: isDark 
                            ? 'rgba(255, 255, 255, 0.8)' 
                            : 'rgba(99, 102, 241, 0.8)'
                    });
                }
            });
        },

        destroyInstance(id) {
            if (this.instances[id]) {
                this.instances[id].stop();
                delete this.instances[id];
            }
        }
    };

    // 粒子效果管理
    const ParticlesManager = {
        instances: {},
        
        init() {
            // 为每个需要粒子效果的容器创建实例
            const sections = document.querySelectorAll('.section-with-particles');
            sections.forEach(section => {
                const particlesInstance = new ParticlesBackground({
                    particleColor: '#6366f1',
                    particleSize: 2,
                    particleCount: 50,
                    particleSpeed: 0.5,
                    lineColor: 'rgba(99, 102, 241, 0.1)',
                    lineLength: 150,
                    particleLife: 3
                });
                
                // 为每个section添加唯一ID
                const id = section.id || `particles-${Math.random().toString(36).substr(2, 9)}`;
                section.id = id;
                
                // 初始化并存储实例
                particlesInstance.init(id);
                particlesInstance.start();
                this.instances[id] = particlesInstance;
            });

            // 监听主题变化
            document.addEventListener('themeChange', (e) => {
                const isDark = e.detail.theme === 'dark';
                this.updateAllParticles(isDark);
            });

            // 初始主题设置
            const isDark = document.body.dataset.theme === 'dark';
            this.updateAllParticles(isDark);
        },

        updateAllParticles(isDark) {
            const color = isDark ? '#818cf8' : '#6366f1';
            const lineColor = isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.1)';
            
            Object.values(this.instances).forEach(instance => {
                instance.updateOptions({
                    particleColor: color,
                    lineColor: lineColor
                });
            });
        },

        destroyInstance(id) {
            if (this.instances[id]) {
                this.instances[id].stop();
                delete this.instances[id];
            }
        }
    };

    // 页面过渡效果
    const PageTransition = {
        init() {
            this.transition = document.querySelector('.page-transition');
            if (!this.transition) return;
            
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (link && link.href && !link.target && !link.hasAttribute('download')) {
                    e.preventDefault();
                    this.navigate(link.href);
                }
            });
            
            window.addEventListener('popstate', () => {
                this.transition.classList.remove('active');
            });
        },
        
        async navigate(url) {
            this.transition.classList.add('active');
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            window.location.href = url;
        }
    };

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', () => {
        themeManager.init();
        scrollProgress.init();
        pageAnimations.init();
        contactForm.init();
        card3DEffect.init();
        pageLoader.init();
        navbar.init();
        BackgroundManager.init();
        ParticlesManager.init();
        PageTransition.init();
        
        // 移除加载动画
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
        
        try {
            initLoader();
            initCustomCursor();
            initNavigation();
            initThemeToggle();
            initScrollAnimations();
            initSkillsAnimation();
            initLabItems();
            initFormValidation();
        } catch (error) {
            utils.handleError(error, 'initialization');
        }
    });

    // 页面可见性变化时处理粒子动画
    document.addEventListener('visibilitychange', () => {
        if (window.particleSystem) {
            if (document.hidden) {
                window.particleSystem.stop();
            } else {
                window.particleSystem.start();
            }
        }
    });

    // 加载动画
    function initLoader() {
        const loader = document.querySelector('.loader');
        if (!loader) return;

        window.addEventListener('load', () => {
            try {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }, 1500);
            } catch (error) {
                utils.handleError(error, 'loader');
            }
        });
    }

    // 自定义鼠标
    function initCustomCursor() {
        const cursor = document.querySelector('.cursor');
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        
        if (!cursor || !cursorDot || !cursorOutline) return;

        const updateCursor = utils.throttle((e) => {
            try {
                const posX = e.clientX;
                const posY = e.clientY;

                requestAnimationFrame(() => {
                    cursorDot.style.transform = `translate(${posX}px, ${posY}px)`;
                    cursorOutline.style.transform = `translate(${posX - 16}px, ${posY - 16}px)`;
                });
            } catch (error) {
                utils.handleError(error, 'cursor update');
            }
        }, 16); // 约60fps

        document.addEventListener('mousemove', updateCursor);

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

        if (!navToggle || !navLinks || !navItems.length) return;

        // 移动端菜单切换
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            const isExpanded = navToggle.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // 导航项点击
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                try {
                    // 移除所有活动状态
                    navItems.forEach(link => link.classList.remove('active'));
                    // 添加当前活动状态
                    item.classList.add('active');
                    
                    // 更新aria-current属性
                    navItems.forEach(link => link.removeAttribute('aria-current'));
                    item.setAttribute('aria-current', 'page');

                    // 如果是移动端，点击后关闭菜单
                    if (window.innerWidth <= 768) {
                        navLinks.classList.remove('active');
                        navToggle.classList.remove('active');
                        navToggle.setAttribute('aria-expanded', 'false');
                    }
                } catch (error) {
                    utils.handleError(error, 'navigation click');
                }
            });
        });

        // 滚动监听
        const handleScroll = utils.throttle(() => {
            try {
                const fromTop = window.scrollY + 100;

                // 更新导航项状态
                navItems.forEach(item => {
                    const section = document.querySelector(item.hash);
                    if (!section) return;
                    
                    if (
                        section.offsetTop <= fromTop &&
                        section.offsetTop + section.offsetHeight > fromTop
                    ) {
                        navItems.forEach(link => {
                            link.classList.remove('active');
                            link.removeAttribute('aria-current');
                        });
                        item.classList.add('active');
                        item.setAttribute('aria-current', 'page');
                    }
                });

                // 导航栏背景透明度
                const nav = document.querySelector('.main-nav');
                if (nav) {
                    requestAnimationFrame(() => {
                        nav.style.background = window.scrollY > 100 
                            ? 'rgba(26, 27, 75, 0.95)'
                            : 'rgba(26, 27, 75, 0.8)';
                    });
                }
            } catch (error) {
                utils.handleError(error, 'scroll handler');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

    // 主题切换
    function initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        // 获取用户偏好的主题
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let isDark = localStorage.getItem('theme') === 'dark' || prefersDark;

        // 初始化主题
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        themeToggle.classList.toggle('light-mode', !isDark);

        themeToggle.addEventListener('click', () => {
            try {
                isDark = !isDark;
                document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                themeToggle.classList.toggle('light-mode', !isDark);
            } catch (error) {
                utils.handleError(error, 'theme toggle');
            }
        });
    }

    // 滚动动画
    function initScrollAnimations() {
        const sections = document.querySelectorAll('.section');
        const cards = document.querySelectorAll('.card');
        
        if (!sections.length && !cards.length) return;

        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    try {
                        entry.target.classList.add('animate-in');
                        if (entry.target.classList.contains('skill-card')) {
                            const levelBar = entry.target.querySelector('.level-bar');
                            if (levelBar && levelBar.dataset.level) {
                                levelBar.style.width = levelBar.dataset.level + '%';
                            }
                        }
                        observer.unobserve(entry.target);
                    } catch (error) {
                        utils.handleError(error, 'scroll animation');
                    }
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

    // 表单验证
    function initFormValidation() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const validateField = (field) => {
            const value = field.value.trim();
            const errorElement = field.nextElementSibling;
            let isValid = true;
            let errorMessage = '';

            switch (field.type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    isValid = emailRegex.test(value);
                    errorMessage = isValid ? '' : '请输入有效的邮箱地址';
                    break;
                case 'text':
                    isValid = value.length >= 2;
                    errorMessage = isValid ? '' : '请输入至少2个字符';
                    break;
                case 'textarea':
                    isValid = value.length >= 10;
                    errorMessage = isValid ? '' : '请输入至少10个字符';
                    break;
            }

            field.setAttribute('aria-invalid', !isValid);
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }

            return isValid;
        };

        // 实时验证
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', utils.debounce(() => {
                validateField(field);
            }, 500));
        });

        // 表单提交
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                let isValid = true;
                const formData = new FormData(form);
                const data = {};

                // 验证所有字段
                form.querySelectorAll('input, textarea').forEach(field => {
                    if (!validateField(field)) {
                        isValid = false;
                    }
                    data[field.name] = field.value;
                });

                if (!isValid) return;

                // 这里添加表单提交逻辑
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('提交失败');
                }

                // 成功提示
                alert('消息已发送！');
                form.reset();

            } catch (error) {
                utils.handleError(error, 'form submission');
                alert('发送失败，请稍后重试');
            }
        });
    }

})();
