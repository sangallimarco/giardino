class SocketService {

    constructor() {
        this.socket = null;
    }

    init(token) {
        let socket = window
            .io
            .connect();

        socket.on('disconnect', () => {
            window
                .location
                .reload();
        });

        // JWT
        return new Promise((resolve, reject) => {
            socket.on('connect', () => {
                socket.emit('authenticate', {token});

                socket.on('authenticated', () => {
                    this.socket = socket;
                    resolve(socket);
                });

                socket.on('unauthorized', (msg) => {
                    this.socket = null;
                    reject(msg.data);
                });
            });
        });

    }

    emit(id, payload) {
        if (this.socket) {
            this
                .socket
                .emit(id, payload);
        }
    }

    subscribe(id, resolve) {
        if (this.socket) {
            this
                .socket
                .on(id, (payload) => {
                    resolve(payload);
                });
        }
    }

    dispatch(actions) {
        if (this.socket) {
            let keys = Object.keys(actions);

            keys.forEach(id => {
                let resolve = actions[id];
                this.subscribe(id, resolve);
            });
        }
    }

    destroy(actions) {
        if (this.socket) {
            let keys = Object.keys(actions);

            keys.forEach(id => {
                this
                    .socket
                    .off(id, actions[id]);
            });
        }
    }
}

export default new SocketService();