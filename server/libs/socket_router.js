class SocketRouter {
    constructor(io) {
        this.io = io;
        this.sockets = {};
        this.routes = [];

        // init socket and append all routes
        this.io.on('connection', socket => {
            this.appendRoutes(socket);
        });

        // handle here disconnections...
    }

    appendRoutes(socket) {
        let {
            id
        } = socket;

        Object.assign(this.sockets, {
            [id]: socket
        });

        this.routes.forEach(route => {
            let {
                id,
                callback
            } = route;

            // append to socket
            socket.on(id, (data) => callback(socket, data));
        });
    }

    use(id, callback) {
        this.routes.push({
            id,
            callback
        });
    }
}

module.exports = SocketRouter;