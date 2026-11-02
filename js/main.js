/**
 * Main Application Orchestrator for Rouf,s Birthday Experience
 * Coordinates prologue reveal sequences, warp navigation, love letter interaction,
 * easter egg discovery, and celebrations.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. ACT I — THE MYSTERY & OPENING PROLOGUE SEQUENCE
       ========================================================================== */
    const q1 = document.getElementById('q1');
    const q2 = document.getElementById('q2');
    const q3 = document.getElementById('q3');
    const constellationGlow = document.getElementById('constellationGlow');
    const revealTitleGroup = document.getElementById('revealTitleGroup');
    const enterUniverseBtn = document.getElementById('enterUniverseBtn');

    const runPrologueSequence = () => {
        // Step 1: Quote 1
        setTimeout(() => {
            if (q1) q1.classList.add('visible');
        }, 900);

        // Step 2: Quote 2
        setTimeout(() => {
            if (q2) q2.classList.add('visible');
        }, 3200);

        // Step 3: Quote 3
        setTimeout(() => {
            if (q3) q3.classList.add('visible');
        }, 5200);

        // Step 4: Constellation Glow Ring
        setTimeout(() => {
            if (constellationGlow) constellationGlow.classList.add('visible');
        }, 7400);

        // Step 5: Full Reveal Group (rouf, Farha, Enter Button)
        setTimeout(() => {
            if (revealTitleGroup) revealTitleGroup.classList.add('visible');
        }, 9200);
    };

    runPrologueSequence();

    /* ==========================================================================
       2. CINEMATIC ENTER BUTTON & WARP SPEED TRANSITION
       ========================================================================== */
    if (enterUniverseBtn) {
        enterUniverseBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Initialize & start audio smoothly
            if (window.cosmicAudio) {
                window.cosmicAudio.startExperienceAudio();
            }

            // 2. Button visual reaction
            enterUniverseBtn.style.transform = 'scale(0.95)';
            enterUniverseBtn.style.filter = 'brightness(1.5)';

            // 3. Trigger 3D hyperspace warp transition on canvas
            if (window.cosmicGalaxy) {
                window.cosmicGalaxy.triggerWarpTransition(() => {
                    // 4. Smoothly scroll into Act II: Our Story
                    const actStory = document.getElementById('act-story');
                    if (actStory) {
                        actStory.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            } else {
                const actStory = document.getElementById('act-story');
                if (actStory) actStory.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* ==========================================================================
       3. NAVIGATION BAR & SECTION OBSERVER
       ========================================================================== */
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('.act-section');

    // Smooth scroll on dot click
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update active nav dot on scroll
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navDots.forEach(dot => {
                    if (dot.getAttribute('data-target') === id) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });

                // Auto-trigger gentle celebration stardust when entering celebration act
                if (id === 'act-celebration' && window.cosmicCelebration) {
                    window.cosmicCelebration.triggerShower(window.innerWidth / 2, window.innerHeight * 0.35, 60);
                }
            }
        });
    }, {
        threshold: 0.35
    });

    sections.forEach(sec => sectionObserver.observe(sec));

    /* ==========================================================================
       4. ACT IV — 3D LOVE LETTER ENVELOPE INTERACTION
       ========================================================================== */
    const envelope3D = document.getElementById('envelope3D');
    const waxSeal = document.getElementById('waxSeal');
    const openLetterBtn = document.getElementById('openLetterBtn');
    const letterBtnText = document.getElementById('letterBtnText');

    const toggleEnvelope = () => {
        if (!envelope3D) return;
        const isOpened = envelope3D.classList.contains('opened');

        if (isOpened) {
            envelope3D.classList.remove('opened');
            if (letterBtnText) letterBtnText.textContent = 'CLICK TO OPEN THE LETTER';
        } else {
            envelope3D.classList.add('opened');
            if (letterBtnText) letterBtnText.textContent = 'FOLD LETTER BACK INTO ENVELOPE';

            // Gentle audio chime or volume swell
            if (window.cosmicAudio && window.cosmicAudio.synthActive) {
                window.cosmicAudio.playSoftTone(523.25, 4, 0.08); // High C chime
            }
        }
    };

    if (waxSeal) waxSeal.addEventListener('click', toggleEnvelope);
    if (openLetterBtn) openLetterBtn.addEventListener('click', toggleEnvelope);

    /* ==========================================================================
       5. SECRET EASTER EGG STARS SYSTEM
       ========================================================================== */
    const secretStars = document.querySelectorAll('.secret-star');
    const easterEggToast = document.getElementById('easterEggToast');
    const toastMessage = document.getElementById('toastMessage');
    let toastTimeout = null;

    secretStars.forEach(star => {
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            const secret = star.getAttribute('data-secret') || 'You found a quiet star made just for you.';

            if (toastMessage && easterEggToast) {
                toastMessage.innerHTML = secret;
                easterEggToast.classList.add('show');

                if (toastTimeout) clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => {
                    easterEggToast.classList.remove('show');
                }, 4500);
            }

            // Star visual twinkle reaction
            star.style.transform = 'scale(1.8) rotate(180deg)';
            setTimeout(() => {
                star.style.transform = '';
            }, 600);
        });
    });

    /* ==========================================================================
       6. ACT V — CELEBRATION BUTTONS & MAKE A WISH
       ========================================================================== */
    const launchCelebrationBtn = document.getElementById('launchCelebrationBtn');
    const makeWishBtn = document.getElementById('makeWishBtn');
    const wishConfirmation = document.getElementById('wishConfirmation');

    if (launchCelebrationBtn) {
        launchCelebrationBtn.addEventListener('click', (e) => {
            const rect = launchCelebrationBtn.getBoundingClientRect();
            const originX = rect.left + rect.width / 2;
            const originY = rect.top;

            if (window.cosmicCelebration) {
                window.cosmicCelebration.triggerShower(originX, originY, 140);
            }
        });
    }

    if (makeWishBtn) {
        makeWishBtn.addEventListener('click', (e) => {
            if (window.cosmicCelebration) {
                window.cosmicCelebration.triggerShower(window.innerWidth / 2, window.innerHeight * 0.4, 180);
            }

            if (wishConfirmation) {
                wishConfirmation.classList.add('show');
            }

            makeWishBtn.style.transform = 'scale(0.96)';
            setTimeout(() => {
                makeWishBtn.style.transform = '';
            }, 200);
        });
    }

    /* ==========================================================================
       7. ACT VI — RELIVE THE UNIVERSE
       ========================================================================== */
    const reliveBtn = document.getElementById('reliveExperienceBtn');
    if (reliveBtn) {
        reliveBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       8. CURSOR GLOW FOLLOWER
       ========================================================================== */
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const updateCursor = () => {
            currentX += (mouseX - currentX) * 0.12;
            currentY += (mouseY - currentY) * 0.12;
            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;
            requestAnimationFrame(updateCursor);
        };
        updateCursor();
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }

});
