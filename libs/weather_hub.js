const config = require('config');
const queue = require('./queue');
const develop = process.env.NODE_ENV === 'development';

const gpio = develop ? require('./gpio_mock') : require('./gpio');

const pins = config.get('CORE.PINS');
const when = config.get('CORE.WHEN');
const delayOn = config.get('CORE.ON');
const delayOff = config.get('CORE.OFF');

const Forecast = require('forecast');
const forecastKey = config.get('FORECAST.KEY');
const forecastLatLon = config.get('FORECAST.LATLON');
const forecast = new Forecast({
    service: 'darksky',
    key: forecastKey,
    units: 'celcius',
    cache: true, // Cache API requests 
    ttl: {
        minutes: 27,
        seconds: 45
    }
});

class WeatherHub {
    constructor() {
        this.lock = false;
        this.forecast = null;

        let q = new queue();
        q.on('change', (pin, state) => {
            this.setPin(pin, state);
        });
        q.on('end', () => {
            console.log('Ended');
            this.lock = false;
            this.run();
        });
        
        // destroy queue later
        this.q = q;
    }

    run() {
        if (!this.lock) {
            let now = new Date();
            let h = now.getHours();
            let m = now.getMinutes();

            // trigger
            console.dir('Checking Time...');
            if ((when.includes(h) && m === 0) || develop) {
                // now get the forecast
                console.dir('Checking Weather...');
                forecast.get(forecastLatLon, (err, weather) => {
                    if (err) {
                        // try again
                        setTimeout(() => {
                            this.run();
                        }, 10000);
                        return console.dir(err);
                    }

                    // data returned now check
                    let {
                        cloudCover,
                        temperature
                    } = weather.currently;

                    if (cloudCover < 1 && temperature > 5) {
                        this.restartQueue();
                    }
                });

            } else {
                setTimeout(() => {
                    this.run();
                }, 5000);
            }
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

    start() {
        // wait for pins
        gpio.init(pins)
            .then(
                () => {
                    this.run();
                }
            );
    }

}

module.exports = new WeatherHub();