const queue = require('./queue');
const develop = process.env.NODE_ENV === 'development';

const gpio = develop ? require('./gpio_mock') : require('./gpio');

const config = require('config');
const Forecast = require('forecast');

const pins = config.get('CORE.PINS');
const when = config.get('CORE.WHEN');
const delayOn = config.get('CORE.ON');
const delayOff = config.get('CORE.OFF');

const forecastKey = config.get('FORECAST.KEY');
const forecastLatLon = config.get('FORECAST.LATLON');

class WeatherHub {
    constructor() {
        this.lock = false;
    }

    run() {
        let now = new Date();
        let h = now.getHours();
        let m = now.getMinutes();

        // trigger
        if (when.includes(h) && m === 0) {
            // now get the forecast
            this.forecast.get(forecastLatLon, (err, weather) => {
                if (err) {
                    // try again
                    setTimeout(() => {
                        this.run();
                    }, 10000);
                    return console.dir(err);
                }

                if (weather) {
                    this.initQueue();
                }
            });

        } else {
            setTimeout(() => {
                this.run();
            }, 1000);
        }
    }

    initQueue() {
        this.lock = true;

        let q = new queue(pins, delayOn, delayOff);
        q.on('change', (pin, state) => {
            this.setPin(pin, state);
        });
        q.on('end', () => {
            console.log('Ended');
            this.lock = false;
            this.run();
        });

        console.log('Running Queue...');
        q.run();

        // destroy queue later
        this.q = q;
    }

    initForecast() {
        this.forecast = new Forecast({
            service: 'darksky',
            key: forecastKey,
            units: 'celcius',
            cache: true, // Cache API requests 
            ttl: {
                minutes: 27,
                seconds: 45
            }
        });
    }

    setPin(pin, state) {
        console.log('Set Pin', pin, state);
        gpio.setPin(pin, state);
    }

    start() {
        // wait for pins
        gpio.init(pins)
            .then(
                () => {
                    this.initQueue();
                }
            );
    }

}

module.exports = new WeatherHub();