class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm;
        // data 中的属性名称
        this.key = key;
        // 回调函数负责更新视图
        this.cb = cb;

        // 把 watcher 对象记录到 Dep 类的静态属性 target
        Dep.target = this;
        // 触发 get 方法，在此方法中会调用 addSub。先代理到 _proxyData中，返回data[key]再代理到Observer中的getter中
        this.oldValue = vm[key];
        Dep.target = null // 防止重复添加
    }

    // 当数据发生变化的时候更新视图
    update() {
        const newValue = this.vm[this.key];
        if (newValue === this.oldValue) {
            return;
        }

        // 当数据变化时，需要将新的值传递给回调函数，更新视图
        this.cb(newValue);
    }
}