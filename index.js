const queue = require('./libs/queue');
const pins = [7, 11, 13, 15, 19];

let q = new queue(pins);

q.on('change', (pin, state) => {
        console.log(pin, state);
});

q.run();