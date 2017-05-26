const queue = require('./libs/queue');
const gpio = require('./libs/gpio');
const pins = [7, 11, 13, 15, 19];

const sec = 1000;
const min = sec * 60;
const repeat = min * 60 * 6; // every 6 hours
const delayOn = min * 10; // 10 mins
const delayOff = sec * 10; // 10 secs

const q = new queue();
q.on('change', (pin, state) => {
        console.log('Set Pin', pin, state);
        gpio.setPin(pin, state);
});
q.on('end', () => {
        console.log('Ended');
        setTimeout(() => {
                start();
        }, repeat);
});


// restart
function start() {
        console.log('Initialising Queue...');
        q.init(pins, delayOn, delayOff);
        console.log('Running Queue...');
        q.run();
}

// first run
gpio.init(pins)
        .then(
                () => {
                        start();
                }
        );