class Compiler {
    constructor(vm) {
        this.el = vm.$el;
        this.vm = vm;
        this.compile(this.el);
    }

    // 编译模板，处理文本节点（插值表达式）和元素节点（指令）
    compile(el) {
        const childNodes = el.childNodes; // 伪数组
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compileText(node);
            } else if (this.isElementNode(node)) {
                this.compileElement(node);
            }

            // 判断node节点，是否有子节点，如果有，则递归调用 compile
            if (node.childNodes && node.childNodes.length) {
                this.compile(node);
            }
        })
    }

    // 编译元素节点，处理指令
    compileElement(node) {
        // 遍历所有属性节点
        Array.from(node.attributes).forEach(attr => {
            // 判断是否味指令
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                // v-text ---> text
                attrName = attrName.substr(2);
                const key = attr.value; // 获取属性值
                this.update(node, key, attrName);
            }
        })
    }

    update(node, key, attrName) {
        const updateFn = this[attrName + 'Updater'];
        // 改变 updateFn 方法中的 this 指向
        updateFn && updateFn.call(this, node, this.vm[key], key);
    }

    // 处理 v-text 指令
    textUpdater(node, value, key) {
        node.textContent = value;

        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue;
        });
    }

    // 处理 v-model 指令
    modelUpdater(node, value, key) {
        node.value = value;

        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue;
        });

        // 双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value;
        })
    }

    // 编译文本节点，处理 差值表达式
    compileText(node) {
        // {{ msg }}
        // . 匹配认一的单个字符，不包括换行
        // + 匹配前面修饰的字符出现一次或多次
        // ? 非贪婪模式，即尽可能早的结束匹配
        // 在正则表达式中，提取某个位置的内容，即添加()，进行分组
        const reg = /\{\{(.+?)\}\}/
        const value = node.textContent;
        if (reg.test(value)) {
            // 使用 RegExp 的构造函数，获取第一个分组的内容，即.$1
            const key = RegExp.$1.trim();
            node.textContent = value.replace(reg, this.vm[key]);

            // 创建watcher对象，当数据改变时更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = value.replace(reg, newValue);
            })
        }
    }

    // 判断元素属性是否指令
    isDirective(attrName) {
        return attrName.startsWith('v-');
    }

    isTextNode(node) {
        return node.nodeType === 3;
    }

    isElementNode(node) {
        return node.nodeType === 1;
    }
}