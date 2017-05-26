const EventEmitter = require('events');

class Queue extends EventEmitter {
    constructor() {
        super();
        this.queue = [];
    }

    init(pins, delayOn = 2000, delayOff = 3000) {
        pins.forEach(x => {
            this.queue.push(
                this.createItem(x, true, delayOn),
                this.createItem(x, false, delayOff)
            );
        });
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
                this.emit('change', pin, status);
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