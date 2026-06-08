class Edible {
    isEdible()              { throw new Error("Edible.isEdible() harus diimplementasikan"); }
    getValue()              { throw new Error("Edible.getValue() harus diimplementasikan"); }
    onEaten(game)           { throw new Error("Edible.onEaten() harus diimplementasikan"); }
    respawn(occupied, size) { throw new Error("Edible.respawn() harus diimplementasikan"); }
}

Edible.isImplementedBy = function (obj) {
    return obj
        && typeof obj.isEdible === 'function'
        && typeof obj.getValue === 'function'
        && typeof obj.onEaten  === 'function'
        && typeof obj.respawn  === 'function';
};
