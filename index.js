const cron = require('node-cron');
const config = require('config');
const WeatherHub = require('./libs/weather_hub');
const when = config.get('CORE.CRON');
const port = config.get('API.PORT');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// static files
app.use(express.static('app/build'));

// first run
WeatherHub.init();
cron.schedule(when, () => {
    WeatherHub.run();
});

// force status from api
// app.get('/run', (req, res) => {
//     WeatherHub.run();
//     res.json({
//         status: true
//     });
// });
// app.get('/status', (req, res) => {
//     WeatherHub.getWeather()
//         .then(weather => {
//             res.json(weather);
//         });

// });

// test
app.get('/', (req, res) => {
    res.sendfile(__dirname + '/app/build/index.html');
});

io.on('connection', (socket) => {
    socket.emit('news', {
        hello: 'world'
    });
    socket.on('my other event', (data) => {
        console.log(data);
    });
});


server.listen(port, () => {
    console.log('Listening on port 3000', port);
});