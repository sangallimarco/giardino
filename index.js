const queue = require('./libs/queue');
const gpio = require('./libs/gpio');
const pins = [7, 11, 13, 15, 19];
const repeat = 10000;
const delayOn = 2000;
const delayOff = 1000;

const q = new queue();
q.on('change', (pin, state) => {
        console.log(pin, state);
        gpio.setPin(pin, state);
});
q.on('end', () => {
        console.log('Ended');

        // restart
        setTimeout(() => {
                start();
        }, repeat);
});


// restart
function start() {
        q.init(pins, delayOn, delayOff);
        q.run();
};

// first run
gpio.init(pins)
        .then(
                res => {
                        start();
                }
        );