const EventEmitter = require('events');

class Queue extends EventEmitter {
    constructor() {
        super();
        this.queue = [];
        this.queueLength = 0;
    }

    init(pins, delayOn = 2000, delayOff = 3000) {
        pins.forEach(x => {
            this.queue.push(
                this.createItem(x, true, delayOn),
                this.createItem(x, false, delayOff)
            );
        });

        this.queueLength = this.queue.length;
    }

    createItem(pin, status, delay) {
        return {
            pin,
            status,
            delay
        };
    }

    run() {
        if (this.queue.length) {
            let item = this.queue.shift();

            if (item) {
                let {
                    pin,
                    status,
                    delay
                } = item;
                let queued = this.queue.length;
                let queueLength = this.queueLength;

                this.emit('change', pin, status, queued, queueLength);
                setTimeout(() => {
                    this.run();
                }, delay);
            }
        } else {
            this.emit('end');
        }
    }

}

module.exports = Queue;