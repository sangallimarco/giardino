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
const SocketRouter = require('./socket_router');

class WeatherHub {
    constructor() {
        // unlock when all is ready
        this.lock = true;

        this.forecast = null;

        let q = new queue();
        q.on('change', (pin, state, queued, items) => {
            this.setPin(pin, state);
            SocketRouter.broadcast('/queue', {
                status: 'change',
                state,
                queued,
                items,
                pin
            });
        });
        q.on('end', () => {
            console.log('Ended');
            this.lock = false;
            SocketRouter.broadcast('/end', {
                status: false
            });
        });

        // destroy queue later
        this.q = q;
    }

    run(force = false) {
        if (!this.lock) {
            // now get the forecast
            console.log('Checking Weather...');

            if (!force) {
                this.getWeather()
                    .then(weather => {
                        // data returned now check
                        let {
                            precipProbability,
                            temperature
                        } = weather;

                        console.log('Weather:', weather);

                        if (precipProbability < 0.5 && temperature > 10) {
                            this.restartQueue();
                        }
                    })
                    .catch(err => {
                        // try again
                        setTimeout(() => {
                            this.run();
                        }, 10000);
                        return console.log(err);
                    });
            } else {
                this.restartQueue();
            }
        } else {
            console.log('Already Running...');
        }
    }

    getWeather() {
        return new Promise((resolve, reject) => {
            forecast.get(forecastLatLon, (err, weather) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(weather.currently);
                }

            });
        });
    }

    restartQueue() {
        console.log('Restarting Queue...');
        this.lock = true;
        this.q.init(pins, delayOn, delayOff, true);
        this.q.run();
    }

    stop() {
        console.log('Stopping Queue...');
        this.lock = true;
        this.q.init(pins, delayOn, delayOff, false);
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