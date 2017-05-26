const EventEmitter = require('events');

class Queue extends EventEmitter {
    constructor(pins, gpio) {
        super();
        this.queue = [];

        pins.forEach(x => {
            this.queue.push(
                this.createItem(x, true, 10000),
                this.createItem(x, false, 2000)
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
            let item = this.queue.pop();

            if (item) {
                let {
                    pin,
                    status,
                    delay
                } = item;
                this.emit('change', pin, status);
                setTimeout(() => {
                    this.run()
                }, delay);
            }
        }
    }

}

module.exports = Queue;