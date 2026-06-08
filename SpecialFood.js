class SpecialFood extends Food {
    constructor() {
        super();
        this.value   = 20;
        this.color   = '#ffd700';
        this.active  = false;
        this.timeout = null;
    }

    isEdible() { return this.active; }
    isActive() { return this.active; }

    onEaten(game) {
        this.deactivate();
        // jadwalkan kemunculan berikutnya
        setTimeout(() => this.respawn(game.snake.getBody(), game.gridSize), 3000);
    }

    respawn(occupiedPositions, gridSize) {
        if (Math.random() > 0.3) {
            this.active = false;
            return;
        }
        super.respawn(occupiedPositions, gridSize);
        this.active = true;
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => { this.active = false; }, 5000);
    }

    deactivate() {
        this.active = false;
        if (this.timeout) clearTimeout(this.timeout);
    }

    draw(ctx, tileSize) {
        if (!this.active) return;
        super.draw(ctx, tileSize);
    }
}
