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
            socket.on(id, (payload) => callback(this.io, socket, payload));
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

    /**
     * Get io
     */
    getIo() {
        return this.io;
    }

    /**
     * Broadcast
     */
    broadcast(id, payload) {
        this.io.sockets.emit(id, payload);
    }
}

module.exports = new SocketRouter();