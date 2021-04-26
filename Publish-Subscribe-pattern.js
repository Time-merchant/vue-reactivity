class EventEmitter {
    constructor() {
        this.cache = {}
    }
    on(name, fn) {
        if (this.cache[name]) {
            // 防止重复注册同一事件
            !this.cache[name].includes(fn) && this.cache[name].push(fn);
        } esle {
            this.cache[name] = [fn];
        }
    }
    off(name, fn) {
        const tasks = this.cache[name];
        if (tasks) {
            const index = tasks.findIndex(f => f === fn || f.callback === fn);
            if (index >= 0) {
                tasks.splice(index, 1);
            }
        }
    }
    emit(name, once = false, ...args) {
        if (this.cache[name]) {
            // 创建副本，如果回调函数内继续注册相同事件，会造成死循环
            const tasks = this.cache[name].slice();
            for(let fn of tasks) {
                fn(...args);
            }
            if (once) {
                delete this.cache[name];
            }
        }
    }
}