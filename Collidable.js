class Collidable {
    collidesWith(point) {
        throw new Error("Collidable.collidesWith() harus diimplementasikan");
    }
    getPosition() {
        throw new Error("Collidable.getPosition() harus diimplementasikan");
    }
}

Collidable.isImplementedBy = function (obj) {
    return obj
        && typeof obj.collidesWith === 'function'
        && typeof obj.getPosition === 'function';
};
