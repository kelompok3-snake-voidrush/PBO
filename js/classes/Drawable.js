class Drawable {
    draw(ctx, tileSize) {
        throw new Error("Drawable.draw() harus diimplementasikan oleh subclass");
    }
}

// Helper: cek apakah sebuah objek mengimplementasikan Drawable
Drawable.isImplementedBy = function (obj) {
    return obj && typeof obj.draw === 'function';
};
