class SocketRouter {
    init(io) {
        this.io = io;
        this.routes = [];

        // init socket and append all routes
        this.io.on('connection', socket => {
            this.appendRoutes(socket);

            socket.on('disconnect',
                socket => {
                    console.log(socket);
                });

            socket.on('disconnecting',
                socket => {
                    console.log(socket);
                });
        });
    }

    /**
     * Subscribe socket to all routes
     */
    appendRoutes(socket) {
        this.routes.forEach(route => {
            let {
                id,
                callback
            } = route;

            // append to socket
            socket.on(id, (data) => callback(this.io, socket, data));
        });
    }

    /**
     * Emulates Router
     */
    use(id, callback) {
        this.routes.push({
            id,
            callback
        });
    }
}

module.exports = new SocketRouter();