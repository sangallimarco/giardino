const cron = require('node-cron');
const config = require('config');
const WeatherHub = require('./server/libs/weather_hub');
const when = config.get('CORE.CRON');
const port = config.get('API.PORT');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const server = require('http').Server(app);
const io = require('socket.io')(server);
// io.set('transports', ['websocket']);
const routes = require('./server/auth/routes');

const SocketRouter = require('./server/libs/socket_router');

// static files
app.disable('etag');
app.use(bodyParser.json());
app.use('/app', express.static('app/build'));
app.use('/api', routes);
app.get('/*', (req, res) => {
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

    // socket.emit('server', {     status: true }); to everyone
    io
        .sockets
        .emit('/status', {status: true});
});
SocketRouter.use('/stop', (io, socket, payload) => {
    console.log('Force Stop!', payload);
    WeatherHub.stop();
    // to everyone
    io
        .sockets
        .emit('/status', {status: false});
});

server.listen(port, () => {
    console.log('Listening on port', port);
});