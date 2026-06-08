class Entity {
    constructor(position) {
        if (new.target === Entity) {
            throw new Error("Entity adalah class abstrak.");
        }
        this.position = position;
    }
    getPosition()           { return this.position; }
    collidesWith(point)     { return this.position.equals(point); }
    draw(ctx, tileSize)     { throw new Error("Subclass wajib draw()"); }
}
