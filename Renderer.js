class Renderer {
    constructor(canvasId) {
        this.canvas   = document.getElementById(canvasId);
        this.ctx      = this.canvas.getContext('2d');
        this.tileSize = this.canvas.width / 20;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid(gridSize) {
        this.ctx.strokeStyle = '#3a6a5a';
        this.ctx.lineWidth   = 0.5;
        for (let i = 0; i <= gridSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.tileSize, 0);
            this.ctx.lineTo(i * this.tileSize, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.tileSize);
            this.ctx.lineTo(this.canvas.width, i * this.tileSize);
            this.ctx.stroke();
        }
    }

    /**
     * @param {Drawable[]} drawables
     * @param {number} gridSize
     */
    render(drawables, gridSize) {
        this.clear();
        this.drawGrid(gridSize);
        for (const obj of drawables) {
            if (Drawable.isImplementedBy(obj)) {
                obj.draw(this.ctx, this.tileSize);
            }
        }
    }
}
