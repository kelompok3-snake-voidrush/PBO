class Snake extends Entity {
    constructor() {
        super(new Point(10, 10));
        this.body = [new Point(10, 10), new Point(9, 10), new Point(8, 10)];
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.isGrowing = false;
        this.color = '#4caf50';
    }

    setColor(color) { this.color = color; }
    getHead()       { return this.body[0]; }
    getBody()       { return this.body; }
    getPosition()   { return this.getHead(); }

    changeDirection(newDir) {
        if (this.body.length > 1) {
            const opposites = { RIGHT: 'LEFT', LEFT: 'RIGHT', UP: 'DOWN', DOWN: 'UP' };
            if (opposites[this.direction] === newDir) return false;
        }
        this.nextDirection = newDir;
        return true;
    }

    move(gridSize) {
        this.direction = this.nextDirection;
        const head = this.getHead();
        let newHead = head.copy();
        switch (this.direction) {
            case 'RIGHT': newHead.x++; break;
            case 'LEFT':  newHead.x--; break;
            case 'UP':    newHead.y--; break;
            case 'DOWN':  newHead.y++; break;
        }
        if (newHead.x < 0)         newHead.x = gridSize - 1;
        if (newHead.x >= gridSize) newHead.x = 0;
        if (newHead.y < 0)         newHead.y = gridSize - 1;
        if (newHead.y >= gridSize) newHead.y = 0;
        this.body.unshift(newHead);
        if (!this.isGrowing) this.body.pop(); else this.isGrowing = false;
        this.position = newHead;
    }

    grow() { this.isGrowing = true; }

    checkSelfCollision() {
        const head = this.getHead();
        for (let i = 1; i < this.body.length; i++) {
            if (head.equals(this.body[i])) return true;
        }
        return false;
    }

    reset() {
        this.body = [new Point(10, 10), new Point(9, 10), new Point(8, 10)];
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.isGrowing = false;
        this.position = this.body[0];
    }

    draw(ctx, tileSize) {
        this.body.forEach((segment) => {
            const isHead = segment.equals(this.getHead());
            const x = segment.x * tileSize;
            const y = segment.y * tileSize;
            ctx.fillStyle   = isHead ? '#ffd700' : this.color;
            ctx.shadowColor = isHead ? '#ffd700' : this.color;
            ctx.shadowBlur  = 8;
            ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
            if (isHead) {
                ctx.fillStyle = '#1e3c32';
                ctx.shadowBlur = 0;
                ctx.fillRect(x + 5, y + 5, 4, 4);
                ctx.fillRect(x + tileSize - 9, y + 5, 4, 4);
            }
        });
        ctx.shadowBlur = 0;
    }
}
