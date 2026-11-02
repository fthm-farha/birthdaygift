/**
 * Galaxy Canvas Engine for rouf's Birthday Universe
 * Renders 3D starfield, floating dust, nebula clouds, constellation connections,
 * and cinematic warp speed transitions.
 */

class CosmicGalaxyCanvas {
    constructor() {
        this.canvas = document.getElementById('universeCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.numStars = window.innerWidth < 768 ? 160 : 380;
        this.dustParticles = [];
        this.numDust = window.innerWidth < 768 ? 30 : 70;
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.mouseX = this.width / 2;
        this.mouseY = this.height / 2;
        this.targetMouseX = this.mouseX;
        this.targetMouseY = this.mouseY;

        // Cinematic warp transition state
        this.isWarping = false;
        this.warpSpeed = 1;
        this.maxWarpSpeed = 28;

        this.animationFrameId = null;

        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.createDust();

        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.targetMouseX = e.clientX;
            this.targetMouseY = e.clientY;
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.targetMouseX = e.touches[0].clientX;
                this.targetMouseY = e.touches[0].clientY;
            }
        }, { passive: true });

        this.render = this.render.bind(this);
        this.render();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
    }

    createStars() {
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: (Math.random() - 0.5) * this.width * 2,
                y: (Math.random() - 0.5) * this.height * 2,
                z: Math.random() * 1000 + 1,
                size: Math.random() * 1.6 + 0.4,
                color: this.getRandomCosmicColor(),
                alpha: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }

    createDust() {
        this.dustParticles = [];
        for (let i = 0; i < this.numDust; i++) {
            this.dustParticles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 2.5 + 1,
                color: Math.random() > 0.5 ? 'rgba(255, 123, 159, ' : 'rgba(242, 203, 124, ',
                alpha: Math.random() * 0.35 + 0.1,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35
            });
        }
    }

    getRandomCosmicColor() {
        const colors = [
            '#ffffff', // White
            '#fceecb', // Warm champagne
            '#ffd6a5', // Soft gold
            '#ffb3c6', // Soft pink
            '#b8c0ff'  // Subtle violet
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Cinematic hyperspace warp animation sequence
     */
    triggerWarpTransition(callback) {
        this.isWarping = true;
        const startTime = performance.now();
        const warpDuration = 2200; // 2.2 seconds warp

        const accelerate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / warpDuration, 1);

            if (progress < 0.6) {
                // Accelerating
                this.warpSpeed = 1 + (this.maxWarpSpeed - 1) * Math.pow(progress / 0.6, 2);
            } else {
                // Decelerating smoothly
                const decelProgress = (progress - 0.6) / 0.4;
                this.warpSpeed = this.maxWarpSpeed * (1 - Math.sin(decelProgress * Math.PI / 2)) + 1;
            }

            if (progress < 1) {
                requestAnimationFrame(accelerate);
            } else {
                this.isWarping = false;
                this.warpSpeed = 1;
                if (callback) callback();
            }
        };

        requestAnimationFrame(accelerate);
    }

    render(time = 0) {
        // Smooth mouse dampening
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

        const offsetX = (this.mouseX - this.width / 2) * 0.06;
        const offsetY = (this.mouseY - this.height / 2) * 0.06;

        this.ctx.clearRect(0, 0, this.width, this.height);

        // Subtle cosmic vignette background glow
        const bgGrad = this.ctx.createRadialGradient(
            this.width / 2 - offsetX * 0.5,
            this.height * 0.4 - offsetY * 0.5,
            10,
            this.width / 2,
            this.height / 2,
            Math.max(this.width, this.height) * 0.8
        );
        bgGrad.addColorStop(0, 'rgba(28, 16, 52, 0.4)');
        bgGrad.addColorStop(0.5, 'rgba(12, 8, 26, 0.6)');
        bgGrad.addColorStop(1, 'rgba(5, 4, 10, 0.95)');
        this.ctx.fillStyle = bgGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw and update 3D Stars
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];

            // Move star towards camera (warp speed increases movement)
            const speed = this.isWarping ? this.warpSpeed * 3 : 0.65;
            star.z -= speed;

            if (star.z <= 0) {
                star.z = 1000;
                star.x = (Math.random() - 0.5) * this.width * 2;
                star.y = (Math.random() - 0.5) * this.height * 2;
            }

            // 3D perspective projection
            const k = 280 / star.z;
            const px = star.x * k + centerX - offsetX * (1000 - star.z) * 0.001;
            const py = star.y * k + centerY - offsetY * (1000 - star.z) * 0.001;

            if (px >= 0 && px <= this.width && py >= 0 && py <= this.height) {
                const size = Math.max(0.2, (1 - star.z / 1000) * star.size * 2.4);
                const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.25 + 0.75;
                const alpha = Math.min(1, Math.max(0, star.alpha * twinkle * (1 - star.z / 1200)));

                this.ctx.beginPath();
                if (this.isWarping && this.warpSpeed > 3) {
                    // Draw warp light trails
                    const prevK = 280 / (star.z + speed * 2.5);
                    const prevPx = star.x * prevK + centerX;
                    const prevPy = star.y * prevK + centerY;

                    this.ctx.moveTo(prevPx, prevPy);
                    this.ctx.lineTo(px, py);
                    this.ctx.strokeStyle = star.color;
                    this.ctx.globalAlpha = Math.min(1, alpha * (this.warpSpeed / 8));
                    this.ctx.lineWidth = size * 1.2;
                    this.ctx.stroke();
                } else {
                    // Regular twinkling star
                    this.ctx.arc(px, py, size, 0, Math.PI * 2);
                    this.ctx.fillStyle = star.color;
                    this.ctx.globalAlpha = alpha;
                    this.ctx.fill();
                }
            }
        }

        // Draw floating glowing cosmic dust
        for (let i = 0; i < this.dustParticles.length; i++) {
            const p = this.dustParticles[i];
            p.x += p.vx;
            p.y += p.vy;

            // Wrap edges
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + p.alpha + ')';
            this.ctx.globalAlpha = p.alpha;
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = p.color + '0.6)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }

        this.ctx.globalAlpha = 1;
        this.animationFrameId = requestAnimationFrame(this.render);
    }
}

// Global galaxy instance
window.cosmicGalaxy = new CosmicGalaxyCanvas();
