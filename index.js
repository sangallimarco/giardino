const cron = require('node-cron');
const config = require('config');
const WeatherHub = require('./libs/weather_hub');
const when = config.get('CORE.CRON');
const express = require('express');
const app = express();

// first run
WeatherHub.init();
cron.schedule(when, () => {
    WeatherHub.run();
});

// force status from api
app.get('/run', (req, res) => {
    WeatherHub.run();
    res.json({
        status: true
    });
});
app.get('/status', (req, res) => {
    WeatherHub.getWeather()
        .then(weather => {
            res.json(weather);
        });

});
app.listen(3000, () => {
    console.log('API listening on port 3000');
});