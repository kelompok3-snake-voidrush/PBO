class HighScoreRepository {
    load()       { throw new Error("HighScoreRepository.load() harus diimplementasikan"); }
    save(score)  { throw new Error("HighScoreRepository.save() harus diimplementasikan"); }
}

class LocalStorageHighScoreRepository extends HighScoreRepository {
    constructor(key = 'snakeHighScore') {
        super();
        this.key = key;
    }
    load() {
        return parseInt(localStorage.getItem(this.key) || '0', 10) || 0;
    }
    save(score) {
        localStorage.setItem(this.key, String(score));
    }
}
