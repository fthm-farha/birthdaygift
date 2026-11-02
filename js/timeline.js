/**
 * Interactive Timeline & Cinematic Memory Viewer
 * Handles timeline interactions, 3D memory galaxy clicks,
 * full-screen modal gallery with keyboard navigation and touch gestures.
 */

class CosmicMemoryManager {
    constructor() {
        this.memories = [
            {
                id: 1,
                title: "ROUF",
                badge: "The Birthday Boy",
                image: "assets/images/farhan.jpeg",
                date: "november 2026",
                description: "Your effortless smile that brings light into any room. A constant source of happiness, laughter, and warmth."
            },
            {
                id: 2,
                title: "Farha",
                badge: "With All My Heart",
                image: "assets/images/pic",
                date: "Forever & Always",
                description: "The girl who built this digital universe for you, holding every memory close and thanking the stars for your presence."
            },
            {
                id: 3,
                title: "A Candid Wave",
                badge: "Sweetest Moments",
                image: "assets/images/moment1.jpeg",
                date: "Cherished Day",
                description: "Spontaneous gestures and genuine smiles that quietly turned ordinary moments into unforgettable memories."
            },
            {
                id: 4,
                title: "Days of Learning",
                badge: "Shared Journeys",
                image: "assets/images/moment2.jpeg",
                date: "Working & Growing",
                description: "Working hard towards dreams, sharing laughs with good company, and knowing we support each other through it all."
            },
            {
                id: 5,
                title: "Our Next Chapter",
                badge: "Future Dreams",
                image: "assets/images/farhan.jpeg",
                date: "A Lifetime Ahead",
                description: "[EDIT THIS MEMORY: Every tomorrow is another chance to create something unforgettable together.]"
            }
        ];

        this.currentIndex = 0;

        // Modal Elements
        this.modal = document.getElementById('memoryModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        this.modalNumber = document.getElementById('modalNumber');
        this.modalDate = document.getElementById('modalDate');
        this.closeBtn = document.getElementById('modalCloseBtn');
        this.prevBtn = document.getElementById('modalPrevBtn');
        this.nextBtn = document.getElementById('modalNextBtn');
        this.backdrop = document.getElementById('modalBackdrop');

        // Touch swipe tracking
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.setupTimelineInteractions();
        this.setupGalaxyInteractions();
        this.setupModalInteractions();
    }

    /* Timeline Interactions */
    setupTimelineInteractions() {
        const nodes = document.querySelectorAll('.timeline-node');
        const railGlow = document.getElementById('timelineRailGlow');

        nodes.forEach((node, index) => {
            const marker = node.querySelector('.node-marker-btn');
            if (!marker) return;

            marker.addEventListener('click', () => {
                nodes.forEach(n => n.classList.remove('active-node'));
                node.classList.add('active-node');

                if (railGlow) {
                    const progressPercent = ((index + 1) / nodes.length) * 100;
                    railGlow.style.height = `${progressPercent}%`;
                }

                // Optional subtle scroll into focus
                node.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    /* Memory Galaxy & Sanctuary Clicks */
    setupGalaxyInteractions() {
        const orbitItems = document.querySelectorAll('.memory-orbit-item');
        orbitItems.forEach(item => {
            const index = parseInt(item.getAttribute('data-index') || '0', 10);
            
            item.addEventListener('click', () => {
                this.openModal(index);
            });

            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openModal(index);
                }
            });
        });

        // Also allow clicking hanging sanctuary frames
        const frames = document.querySelectorAll('.hanging-frame');
        frames.forEach((frame, idx) => {
            frame.style.cursor = 'pointer';
            frame.addEventListener('click', () => {
                this.openModal(idx % this.memories.length);
            });
        });
    }

    /* Modal Navigation & Controls */
    setupModalInteractions() {
        if (!this.modal) return;

        // Close button & backdrop
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeModal());
        if (this.backdrop) this.backdrop.addEventListener('click', () => this.closeModal());

        // Previous & Next buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigatePrev();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigateNext();
            });
        }

        // Keyboard navigation (Escape, Left, Right)
        window.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;

            if (e.key === 'Escape') {
                this.closeModal();
            } else if (e.key === 'ArrowLeft') {
                this.navigatePrev();
            } else if (e.key === 'ArrowRight') {
                this.navigateNext();
            }
        });

        // Touch Swipe gestures
        this.modal.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.modal.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipeGesture();
        }, { passive: true });
    }

    handleSwipeGesture() {
        const swipeThreshold = 50;
        const diff = this.touchEndX - this.touchStartX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.navigatePrev(); // Swiped right
            } else {
                this.navigateNext(); // Swiped left
            }
        }
    }

    openModal(index) {
        if (index < 0 || index >= this.memories.length) index = 0;
        this.currentIndex = index;
        this.renderModalContent();

        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll

        // Focus close button for accessibility
        if (this.closeBtn) this.closeBtn.focus();
    }

    closeModal() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore background scroll
    }

    navigatePrev() {
        this.currentIndex = (this.currentIndex - 1 + this.memories.length) % this.memories.length;
        this.renderModalContent();
    }

    navigateNext() {
        this.currentIndex = (this.currentIndex + 1) % this.memories.length;
        this.renderModalContent();
    }

    renderModalContent() {
        const mem = this.memories[this.currentIndex];
        if (!mem) return;

        // Animate image transition
        this.modalImage.style.opacity = '0';
        this.modalImage.style.transform = 'scale(0.96)';

        setTimeout(() => {
            this.modalImage.src = mem.image;
            this.modalImage.alt = mem.title;
            this.modalTitle.textContent = mem.title;
            this.modalDescription.textContent = mem.description;
            this.modalNumber.textContent = `Memory 0${mem.id} of 0${this.memories.length}`;
            this.modalDate.textContent = mem.date;

            this.modalImage.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            this.modalImage.style.opacity = '1';
            this.modalImage.style.transform = 'scale(1)';
        }, 120);
    }
}

// Global instance
window.cosmicMemories = new CosmicMemoryManager();
