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
                    // register all callbacks
                    this.register();
                    // return socket
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

    /**
     * Store all actions
     */
    dispatch(actions) {
        this.actions = actions;
    }

    register() {
        // remove previous subscriptions
        this.destroy(this.actions);

        // add subscriptions
        if (this.socket) {
            let keys = Object.keys(this.actions);

            keys.forEach(id => {
                let resolve = this.actions[id];
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