export class StorageManager {
    constructor(key) {
        this.key = key;
    }

    getAll() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    }

    saveAll(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    add(item) {
        const data = this.getAll();
        data.push(item);
        this.saveAll(data);
    }

    clear() {
        localStorage.removeItem(this.key);
    }

    export() {
        return this.getAll();
    }

    import(data) {
        this.saveAll(data);
    }
}
