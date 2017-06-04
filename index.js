const cron = require('node-cron');
const config = require('config');
const WeatherHub = require('./server/libs/weather_hub');
const when = config.get('CORE.CRON');
const port = config.get('API.PORT');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const SocketRouter = require('./server/libs/socket_router');

// static files
app.use('/app', express.static('app/build'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/app/build/index.html');
});

// first run
WeatherHub.init();
cron.schedule(when, () => {
    WeatherHub.run();
});

// socket router
SocketRouter.init(io);
SocketRouter.use('/start', (io, socket, payload) => {
    console.log('Force Run!', payload);
    WeatherHub.run(true);

    // socket.emit('server', {
    //     status: true
    // });

    // to everyone
    io.sockets.emit('/status', {
        status: true
    });
});

server.listen(port, () => {
    console.log('Listening on port', port);
});