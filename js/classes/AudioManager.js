class AudioManager {
    constructor() {
        this.audioContext = null;
        this.musicOn      = true;
        this.bgAudio      = document.getElementById('gameMusic');
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    setUiButtons(menuBtn, gameBtn) {
        this.menuBtn = menuBtn;
        this.gameBtn = gameBtn;
    }

    toggleMusic() {
        this.musicOn = !this.musicOn;
        if (this.menuBtn) this.menuBtn.textContent = this.musicOn ? '🔊 MUSIK' : '🔈 MUSIK';
        if (this.gameBtn) this.gameBtn.textContent = this.musicOn ? '🔊' : '🔈';
        if (this.musicOn) this.bgAudio.play().catch(() => {});
        else              this.bgAudio.pause();
    }

    startMusic() {
        if (this.musicOn) this.bgAudio.play().catch(() => {});
    }

    _beep(freq, type, duration, volume) {
        if (!this.musicOn) return;
        this.init();
        try {
            const osc  = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.type            = type;
            osc.frequency.value = freq;
            gain.gain.value     = volume;
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.start();
            osc.stop(this.audioContext.currentTime + duration);
        } catch (e) {}
    }

    playEatSound()      { this._beep(800, 'sine',     0.1, 0.1); }
    playGameOverSound() { this._beep(200, 'sawtooth', 0.5, 0.2); }
}
