class EventEmitter {
    constructor() {
        this.subs = Object.create(null);
    }

    $on(eventType, handler) {
        this.subs[eventType] = this.subs[eventType] || [];
        this.subs[eventType].push(handler);
    }

    $emit(eventType) {
        if (this.subs[eventType]) {
            this.subs[eventType].forEach(handler => {
                handler();
            });
        }
    }
}

// test
const em = new EventEmitter();
em.$on('click', () => {
    console.log('click1');
});

em.$on('click', () => {
    console.log('click2');
});

em.$emit('click');
