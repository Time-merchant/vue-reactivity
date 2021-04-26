class Vue {
    constructor(options) {
        // 1. 通过属性保存选项数据
        this.$options = options || {};
        this.$data = options.data || {};
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
        // 2. 把 data 中的成员转换成 getter 和 setter，注入到 Vue 实例
        this._proxyData(this.$data);
        // 3. 调用 Observer 对象，监听数据变化
        new Observer(this.$data);
        // 4. 调用 Compiler 对象，解析指令和差值表达式
        new Compiler(this);
    }

    //  预定 _ 开头，为私有属性
    // 代理数据，即让 Vue 代理data中的属性
    _proxyData(data) {
        // 遍历data中的所有属性
        Object.keys(data).forEach(key => {
            // 把data的属性注入到vue实例中
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key];
                },
                set(newValue) {
                    if (data[key] === newValue) {
                        return;
                    }
                    data[key] = newValue;
                }
            })
        })
    }
}

