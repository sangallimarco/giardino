class GPIO {
    constructor() {}

    init(pins) {
        let setups = pins.map(x => this.setUpPin(x));
        return Promise.all(setups);
    }

    setUpPin(pin, mode = '') {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    setPin(pin, value) {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

}

module.exports = new GPIO();