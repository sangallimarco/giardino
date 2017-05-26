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

    setUpPin(pin, mode = DIR_OUT) {
        return new Promise((resolve, reject) => {
            gpio.setup(pin, mode, (err) => {
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