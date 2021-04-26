// 发布者
/**
 * Dep是整个 getter 依赖收集的核心 ，Dep是一个 Class，它定义了一些属性和方法，这里需要特别注意的是它有一个静态属性target，
 * 这是一个全局唯一Watcher，同一时间只能有一个全局的Watcher被计算，Dep实际上就是对Watcher的一种管理，Dep脱离Watcher单独存在是没有意义的

 */
class Dep {
    constructor() {
        // 存储所有观察者
        this.subs = [];
    }

    // 添加观察者
    addSub(sub) {
        if (sub && sub.update) {
            this.subs.push(sub);
        }
    }

    // 发送通知
    notify() {
        // 便利所有观察者
        this.subs.forEach(sub => {
            sub.update();
        })
    }
}