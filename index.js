const cron = require('node-cron');
const config = require('config');
const WeatherHub = require('./libs/weather_hub');
const when = config.get('CORE.CRON');

// first run
WeatherHub.init();
cron.schedule(when, () => {
    WeatherHub.run();
});
