/**
 * Audio Experience Controller for Farhan's Birthday Universe
 * Manages HTML Audio playback, smooth volume fading, equalizer bars,
 * and Web Audio API harmonic soundscape fallback.
 */

class CosmicAudioManager {
    constructor() {
        this.audioElement = document.getElementById('birthdayMusic');
        this.toggleBtn = document.getElementById('musicToggleBtn');
        this.musicBars = document.getElementById('musicBars');
        this.isPlaying = false;
        this.hasInitialized = false;
        
        // Web Audio API context & synthesizer fallback
        this.audioCtx = null;
        this.synthActive = false;
        this.currentChordIndex = 0;
        this.synthInterval = null;

        this.init();
    }

    init() {
        if (!this.audioElement || !this.toggleBtn) return;

        // Set initial state
        this.audioElement.volume = 0;

        // Music toggle click handler
        this.toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.togglePlayState();
        });

        // Listen for audio element state changes
        this.audioElement.addEventListener('play', () => {
            this.setPlayingUI(true);
        });

        this.audioElement.addEventListener('pause', () => {
            this.setPlayingUI(false);
        });

        this.audioElement.addEventListener('ended', () => {
            this.audioElement.currentTime = 0;
            this.audioElement.play().catch(() => {});
        });
    }

    /**
     * Start music on first user intentional interaction (e.g. Enter Universe button)
     */
    startExperienceAudio() {
        if (!this.isPlaying) {
            this.playWithFade(1500);
        }
    }

    togglePlayState() {
        if (this.isPlaying) {
            this.pauseWithFade(800);
        } else {
            this.playWithFade(1200);
        }
    }

    playWithFade(fadeDuration = 1000) {
        this.initWebAudioFallback();

        const playPromise = this.audioElement.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.setPlayingUI(true);
                this.fadeAudio(0, 0.75, fadeDuration);
            }).catch((err) => {
                console.warn('Audio tag play restricted or error, activating romantic synthesizer:', err);
                // Fallback to Web Audio synthesizer
                this.startProceduralRomanticMusic();
            });
        }
    }

    pauseWithFade(fadeDuration = 800) {
        if (this.synthActive) {
            this.stopProceduralRomanticMusic();
        }

        this.fadeAudio(this.audioElement.volume, 0, fadeDuration, () => {
            this.audioElement.pause();
            this.isPlaying = false;
            this.setPlayingUI(false);
        });
    }

    fadeAudio(fromVol, toVol, duration, callback) {
        const startTime = performance.now();
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentVol = fromVol + (toVol - fromVol) * progress;
            this.audioElement.volume = Math.max(0, Math.min(1, currentVol));

            if (progress < 1) {
                requestAnimationFrame(step);
            } else if (callback) {
                callback();
            }
        };
        requestAnimationFrame(step);
    }

    setPlayingUI(playing) {
        this.isPlaying = playing;
        if (playing) {
            this.toggleBtn.classList.add('playing');
            this.toggleBtn.setAttribute('title', 'Pause Our Song');
        } else {
            this.toggleBtn.classList.remove('playing');
            this.toggleBtn.setAttribute('title', 'Play Our Song');
        }
    }

    /* Web Audio Procedural Fallback Engine */
    initWebAudioFallback() {
        if (this.hasInitialized) return;
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.audioCtx = new AudioContextClass();
                this.hasInitialized = true;
            }
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }

    startProceduralRomanticMusic() {
        if (!this.audioCtx) this.initWebAudioFallback();
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        this.synthActive = true;
        this.setPlayingUI(true);

        // Romantic chords: Cmaj9 -> Am9 -> Fmaj7 -> Gsus4 (warm romantic celestial progression)
        const chordProgression = [
            [130.81, 196.00, 246.94, 329.63, 392.00, 493.88], // C, G, B, E, G, B
            [110.00, 164.81, 220.00, 261.63, 329.63, 392.00], // A, E, A, C, E, G
            [87.31, 130.81, 174.61, 220.00, 261.63, 329.63],  // F, C, F, A, C, E
            [98.00, 146.83, 196.00, 261.63, 293.66, 392.00]   // G, D, G, C, D, G
        ];

        const playArpeggio = () => {
            if (!this.synthActive) return;
            const currentChord = chordProgression[this.currentChordIndex];
            this.currentChordIndex = (this.currentChordIndex + 1) % chordProgression.length;

            currentChord.forEach((freq, idx) => {
                setTimeout(() => {
                    if (this.synthActive) this.playSoftTone(freq, 3.5, 0.08);
                }, idx * 450);
            });
        };

        playArpeggio();
        this.synthInterval = setInterval(playArpeggio, 3600);
    }

    stopProceduralRomanticMusic() {
        this.synthActive = false;
        if (this.synthInterval) {
            clearInterval(this.synthInterval);
            this.synthInterval = null;
        }
        this.setPlayingUI(false);
    }

    playSoftTone(freq, duration = 3, volume = 0.06) {
        if (!this.audioCtx || this.audioCtx.state === 'closed') return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            const now = this.audioCtx.currentTime;
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(volume, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {
            // silent fail
        }
    }
}

// Global instance attached to window for easy access
window.cosmicAudio = new CosmicAudioManager();
