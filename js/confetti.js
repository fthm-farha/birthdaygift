/**
 * Celebration Stardust & Confetti Engine
 * Renders elegant, ethereal golden stardust, glowing embers,
 * champagne sparks and celebratory light bursts.
 */

class CosmicCelebrationEngine {
    constructor() {
        this.canvas = document.getElementById('celebrationCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.isActive = false;
        this.animationId = null;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.render = this.render.bind(this);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
    }

    /**
     * Launch a burst of celebratory stardust
     */
    triggerShower(originX = this.width / 2, originY = this.height * 0.45, count = 120) {
        this.isActive = true;

        const colors = [
            'rgba(242, 203, 124, ', // Gold
            'rgba(255, 229, 153, ', // Bright Gold
            'rgba(255, 123, 159, ', // Rose
            'rgba(255, 180, 200, ', // Soft Pink
            'rgba(255, 255, 255, '  // Pure Starlight
        ];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 2;
            this.particles.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                gravity: 0.08,
                drag: 0.98,
                size: Math.random() * 3.5 + 1.2,
                colorBase: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: Math.random() * 0.012 + 0.006,
                rotation: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 0.1,
                shape: Math.random() > 0.4 ? 'star' : 'ember'
            });
        }

        if (!this.animationId) {
            this.render();
        }
    }

    render() {
        if (!this.isActive || this.particles.length === 0) {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.animationId = null;
            this.isActive = false;
            return;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.vx *= p.drag;
            p.vy = p.vy * p.drag + p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.vRot;
            p.alpha -= p.decay;

            if (p.alpha <= 0 || p.y > this.height + 20) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);

            this.ctx.fillStyle = p.colorBase + p.alpha + ')';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = p.colorBase + '0.8)';

            if (p.shape === 'star') {
                // Draw 4-point star
                this.drawStar(0, 0, 4, p.size * 1.8, p.size * 0.7);
            } else {
                // Draw circular ember
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        this.animationId = requestAnimationFrame(this.render);
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            let x = cx + Math.cos(rot) * outerRadius;
            let y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

// Global celebration engine instance
window.cosmicCelebration = new CosmicCelebrationEngine();
