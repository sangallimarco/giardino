const EventEmitter = require('events');

class Queue extends EventEmitter {
    constructor() {
        super();
        this.queue = [];
        this.queueLength = 0;
        this.timer = null;
    }

    init(pins, delayOn = 2000, delayOff = 3000, switcher = true) {
        this.queue = [];

        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        pins.forEach(x => {
            let items = switcher
                ? [
                    this.createItem(x, true, delayOn),
                    this.createItem(x, false, delayOff)
                ]
                : [this.createItem(x, false, delayOff)];
            this
                .queue
                .push(...items);
        });

        this.queueLength = this.queue.length;
    }

    createItem(pin, status, delay) {
        return {pin, status, delay};
    }

    start() {
        let queueLength = this.queueLength;
        this.emit('start', queueLength, queueLength);
        this.run();
    }

    run() {
        if (this.queue.length) {
            let item = this
                .queue
                .shift();

            if (item) {
                let {pin, status, delay} = item;
                let queued = this.queue.length;
                let queueLength = this.queueLength;

                this.emit('change', pin, status, queued, queueLength);
                this.timer = setTimeout(() => {
                    this.run();
                }, delay);
            }
        } else {
            this.emit('end');
        }
    }

}

module.exports = Queue;