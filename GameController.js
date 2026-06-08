class GameController {
    constructor() {
        this.game     = new Game(new LocalStorageHighScoreRepository(), [new Food(), new SpecialFood()]);
        this.renderer = new Renderer('gameCanvas');
        this.audio    = new AudioManager();

        // DOM refs
        this.menuScreen        = document.getElementById('menuScreen');
        this.gameScreen        = document.getElementById('gameScreen');
        this.modal             = document.getElementById('gameoverModal');
        this.highScoreText     = document.getElementById('highScoreText');
        this.gameHighScore     = document.getElementById('gameHighScore');
        this.scoreDisplay      = document.getElementById('scoreDisplay');
        this.finalScoreText    = document.getElementById('finalScoreText');
        this.newHighScoreText  = document.getElementById('newHighScoreText');
        this.instructionsPanel = document.getElementById('instructionsPanel');
        this.pauseBtn          = document.getElementById('pauseBtn');
        this.musicBtn          = document.getElementById('musicBtn');
        this.gameMusicBtn      = document.getElementById('gameMusicBtn');
        this.audio.setUiButtons(this.musicBtn, this.gameMusicBtn);

        this.lastTap        = 0;
        this.touchStartX    = 0;
        this.touchStartY    = 0;
        this.touchStartTime = 0;

        // Pasang hook
        this.game.onAteFood  = () => this.audio.playEatSound();
        this.game.onGameOver = (score) => this.handleGameOver(score);

        this.bindEvents();
        this.updateHighScoreDisplay();
        this.startRenderLoop();
        document.addEventListener('click', () => this.audio.startMusic(), { once: true });
    }

    /* ---------- Event binding ---------- */
    bindEvents() {
        document.getElementById('btnStart').addEventListener('click',        () => this.startGame());
        document.getElementById('btnHighScore').addEventListener('click',    () => this.showHighScore());
        document.getElementById('btnInstructions').addEventListener('click', () => this.toggleInstructions());
        document.getElementById('btnBackMenu').addEventListener('click',     () => this.backToMenu());
        document.getElementById('btnRestart').addEventListener('click',      () => this.restartGame());
        document.getElementById('btnMenu').addEventListener('click',         () => this.backToMenu());
        this.pauseBtn.addEventListener('click',     () => this.togglePause());
        this.musicBtn.addEventListener('click',     () => this.audio.toggleMusic());
        this.gameMusicBtn.addEventListener('click', () => this.audio.toggleMusic());

        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setColor(btn.dataset.color, btn));
        });
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setLevel(btn.dataset.level, btn));
        });
        document.querySelectorAll('.dpad-btn').forEach(btn => {
            const dir = btn.dataset.dir;
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); btn.classList.add('touch-active'); this.changeDir(dir); }, { passive: false });
            btn.addEventListener('touchend',   () => btn.classList.remove('touch-active'));
            btn.addEventListener('click',      () => this.changeDir(dir));
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            const k = e.key;
            if (['ArrowUp', 'w', 'W'].includes(k))    { this.changeDir('UP');    e.preventDefault(); }
            else if (['ArrowDown', 's', 'S'].includes(k))  { this.changeDir('DOWN');  e.preventDefault(); }
            else if (['ArrowLeft', 'a', 'A'].includes(k))  { this.changeDir('LEFT');  e.preventDefault(); }
            else if (['ArrowRight', 'd', 'D'].includes(k)) { this.changeDir('RIGHT'); e.preventDefault(); }
            else if (k === 'p' || k === 'P')               { this.togglePause();      e.preventDefault(); }
        });

        // Swipe & double tap
        const canvas = document.getElementById('gameCanvas');
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const t = e.touches[0];
            this.touchStartX = t.clientX;
            this.touchStartY = t.clientY;
            this.touchStartTime = Date.now();
        }, { passive: false });
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const now = Date.now();
            if (now - this.lastTap < 300) this.togglePause();
            this.lastTap = now;
            if (!this.game.isRunning || this.game.isPaused) return;
            const t  = e.changedTouches[0];
            const dx = t.clientX - this.touchStartX;
            const dy = t.clientY - this.touchStartY;
            if (now - this.touchStartTime < 500 && (Math.abs(dx) > 30 || Math.abs(dy) > 30)) {
                if (Math.abs(dx) > Math.abs(dy)) this.changeDir(dx > 0 ? 'RIGHT' : 'LEFT');
                else                              this.changeDir(dy > 0 ? 'DOWN'  : 'UP');
                if (navigator.vibrate) navigator.vibrate(20);
            }
        }, { passive: false });
        document.body.addEventListener('touchmove', (e) => {
            if (e.target === canvas) e.preventDefault();
        }, { passive: false });
    }

    changeDir(dir) {
        if (!this.game.isRunning || this.game.isPaused) return;
        this.game.snake.changeDirection(dir);
    }

    /* ---------- UI helpers ---------- */
    updateHighScoreDisplay() {
        this.highScoreText.innerHTML = `🏆 ${this.game.highScore}`;
        this.gameHighScore.innerHTML = `🏆 ${this.game.highScore}`;
    }

    setColor(color, element) {
        this.game.setSnakeColor(color);
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        element.classList.add('selected');
    }

    setLevel(level, element) {
        document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
        element.classList.add('active');
        this.game.setSpeed(level);
    }

    toggleInstructions() {
        const p = this.instructionsPanel;
        p.style.display = (p.style.display === 'block') ? 'none' : 'block';
    }

    showHighScore() {
        alert(`High Score: ${this.game.highScore}`);
    }

    showPauseIndicator() {
        const ind = document.createElement('div');
        ind.textContent = '⏸️ PAUSE';
        ind.className = 'pause-indicator';
        document.body.appendChild(ind);
        setTimeout(() => ind.remove(), 800);
    }

    togglePause() {
        const paused = this.game.togglePause();
        this.pauseBtn.textContent = paused ? '▶️' : '⏸️';
        if (paused) this.showPauseIndicator();
    }

    /* ---------- Flow ---------- */
    startGame() {
        this.menuScreen.style.display = 'none';
        this.gameScreen.style.display = 'block';
        this.game.start();
        this.audio.startMusic();
    }

    restartGame() {
        this.modal.style.display = 'none';
        this.startGame();
    }

    backToMenu() {
        this.game.reset();
        this.gameScreen.style.display = 'none';
        this.menuScreen.style.display = 'block';
        this.modal.style.display = 'none';
        this.updateHighScoreDisplay();
        this.scoreDisplay.textContent = '🍎 0';
    }

    handleGameOver(score) {
        this.finalScoreText.textContent = `${score}`;
        this.newHighScoreText.textContent = (score === this.game.highScore && score > 0)
            ? 'HIGH SCORE BARU!' : '';
        this.modal.style.display = 'flex';
        this.updateHighScoreDisplay();
        this.audio.playGameOverSound();
        // High score sudah disimpan di localStorage oleh Game.js
    }

    startRenderLoop() {
        const loop = () => {
            if (this.game.isRunning) {
                this.renderer.render(this.game.getDrawables(), this.game.gridSize);
                this.scoreDisplay.textContent = `🍎 ${this.game.score}`;
                if (this.game.score > this.game.highScore) {
                    this.gameHighScore.textContent = `🏆 ${this.game.score}`;
                }
            }
            requestAnimationFrame(loop);
        };
        loop();
    }
}
