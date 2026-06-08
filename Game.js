class Game {
    constructor(highScoreRepo, foods) {
        this.snake          = new Snake();
        this.foods          = foods || [new Food(), new SpecialFood()];
        this.highScoreRepo  = highScoreRepo;
        this.score          = 0;
        this.highScore      = this.highScoreRepo ? this.highScoreRepo.load() : 0;
        this.isRunning      = false;
        this.isPaused       = false;
        this.gridSize       = 20;
        this.currentLevel   = 'easy';
        this.speedTable     = { easy: 300, medium: 150, hard: 100 };
        this.speed          = this.speedTable[this.currentLevel];
        this.loopInterval   = null;
        this.onAteFood      = null;
        this.onGameOver     = null;
    }

    setSpeed(level) {
        if (this.speedTable[level] == null) return;
        this.currentLevel = level;
        this.speed = this.speedTable[level];
        if (this.isRunning) { this.stopLoop(); this.startLoop(); }
    }

    setSnakeColor(color) { this.snake.setColor(color); }

    startLoop() {
        if (this.loopInterval) clearInterval(this.loopInterval);
        this.loopInterval = setInterval(() => this.update(), this.speed);
    }
    stopLoop() {
        if (this.loopInterval) { clearInterval(this.loopInterval); this.loopInterval = null; }
    }

    start() {
        this.reset();
        this.isRunning = true;
        this.isPaused  = false;
        const occupied = this.snake.getBody();
        this.foods.forEach(f => f.respawn(occupied, this.gridSize));
        this.startLoop();
    }

    reset() {
        this.snake.reset();
        this.score     = 0;
        this.isRunning = false;
        this.foods.forEach(f => { if (typeof f.deactivate === 'function') f.deactivate(); });
        this.stopLoop();
    }

    togglePause() {
        if (!this.isRunning) return false;
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }

    update() {
        if (!this.isRunning || this.isPaused) return;

        this.snake.move(this.gridSize);
        const head = this.snake.getHead();

        // (OCP) Iterasi polimorfik — tidak peduli jenis food
        for (const food of this.foods) {
            if (Edible.isImplementedBy(food)
                && food.isEdible()
                && food.collidesWith(head)) {
                this.snake.grow();
                this.score += food.getValue();
                food.onEaten(this);
                if (typeof this.onAteFood === 'function') this.onAteFood();
            }
        }

        if (this.snake.checkSelfCollision()) this.gameOver();
    }

    gameOver() {
        this.isRunning = false;
        this.stopLoop();
        if (this.score > this.highScore) {
            this.highScore = this.score;
            if (this.highScoreRepo) this.highScoreRepo.save(this.highScore);
        }
        if (typeof this.onGameOver === 'function') this.onGameOver(this.score);
        return this.score;
    }

    getDrawables() { return [this.snake, ...this.foods]; }
}
