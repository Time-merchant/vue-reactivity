// 发布者 - 目标
class Dep {
    constructor() {
        this.subs = [];
    }

    addSub(sub) {
        if (sub && sub.update) {
            this.subs.push(sub);
        }
    }

    notify() {
        this.subs.forEach(sub => {
            sub.update();
        });
    }
}

// 订阅者 - 观察者 
class Watcher {
    constructor() {}

    update() {
        console.log('update!')
    }
}

const dep = new Dep();
const watcher = new Watcher();

dep.addSub(watcher);
dep.notify();
