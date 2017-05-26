const gpio = require('rpi-gpio');
const {
    DIR_OUT
} = gpio;

class GPIO {
    constructor() {}

    init(pins) {
        let setups = pins.map(x => this.setUpPin(x));
        return Promise.all(setups);
    }

    setUpPin(pin, mode) {
        return new Promise((resolve, reject) => {
            gpio.setup(pin, DIR_OUT, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    setPin(pin, value) {
        return new Promise((resolve, reject) => {
            gpio.write(pin, value, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

}

module.exports = new GPIO();