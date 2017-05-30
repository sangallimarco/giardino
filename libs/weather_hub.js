const config = require('config');
const queue = require('./queue');

const develop = process.env.NODE_ENV === 'development';

const gpio = develop ? require('./gpio_mock') : require('./gpio');
const pins = config.get('CORE.PINS');
const delayOn = config.get('CORE.ON');
const delayOff = config.get('CORE.OFF');

const Forecast = require('forecast');
const forecastKey = config.get('FORECAST.KEY');
const forecastLatLon = config.get('FORECAST.LATLON');
const forecast = new Forecast({
    service: 'darksky',
    key: forecastKey,
    units: 'celsius',
    cache: true, // Cache API requests 
    ttl: {
        minutes: 27,
        seconds: 45
    }
});

class WeatherHub {
    constructor() {
        // unlock when all is ready
        this.lock = true;

        this.forecast = null;

        let q = new queue();
        q.on('change', (pin, state) => {
            this.setPin(pin, state);
        });
        q.on('end', () => {
            console.log('Ended');
            this.lock = false;
        });

        // destroy queue later
        this.q = q;
    }

    run() {
        if (!this.lock) {
            // now get the forecast
            console.log('Checking Weather...');
            forecast.get(forecastLatLon, (err, weather) => {
                if (err) {
                    // try again
                    setTimeout(() => {
                        this.run();
                    }, 10000);
                    return console.log(err);
                }

                // data returned now check
                let {
                    precipProbability,
                    temperature
                } = weather.currently;

                console.log('Weather:', weather.currently);

                if (precipProbability < 0.5 && temperature > 10) {
                    this.restartQueue();
                }
            });
        }
    }

    restartQueue() {
        this.lock = true;
        this.q.init(pins, delayOn, delayOff);
        this.q.run();
    }

    setPin(pin, state) {
        console.log('Set Pin', pin, state);
        gpio.setPin(pin, state);
    }

    init() {
        // wait for pins
        gpio.init(pins)
            .then(
                () => {
                    console.log('System configured');
                    this.lock = false;
                }
            );
    }

}

module.exports = new WeatherHub();