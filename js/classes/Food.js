class Food extends Entity {
    constructor() {
        super(new Point(15, 10));
        this.value = 10;
        this.color = '#ff4444';
    }

    // ---- Edible ----
    isEdible() { return true; }
    getValue() { return this.value; }
    onEaten(game) {
        // efek default: regenerasi pada posisi baru
        this.respawn(game.snake.getBody(), game.gridSize);
    }
    respawn(occupiedPositions, gridSize) {
        let newPos, valid = false, attempts = 0;
        while (!valid && attempts < 1000) {
            newPos = new Point(
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize)
            );
            valid = !occupiedPositions.some(p => p.equals(newPos));
            attempts++;
        }
        if (valid) this.position = newPos;
    }

    draw(ctx, tileSize) {
        ctx.fillStyle   = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur  = 10;
        ctx.beginPath();
        ctx.arc(
            this.position.x * tileSize + tileSize / 2,
            this.position.y * tileSize + tileSize / 2,
            tileSize / 3,
            0, 2 * Math.PI
        );
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
