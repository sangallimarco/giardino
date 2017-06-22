class SocketService {

    constructor() {
        this.socket = null;
        this.actions = [];
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
                    this.subscribeActions();
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

    subscribe(path, resolve) {
        if (this.socket) {
            this
                .socket
                .on(path, (payload) => {
                    resolve(payload);
                });
        }
    }

    /**
     * Store all actions
     */
    register(actions = {}) {
        let mapped = [];
        let keys = Object.keys(actions);
        keys.forEach(path => {
            mapped.push({path, resolve: actions[path]});
        });

        this.actions = [
            ...this.actions,
            ...mapped
        ];
    }

    /**
     * Register actions when socket is ready
     */
    subscribeActions() {
        // remove previous subscriptions
        this.destroy();

        // add subscriptions
        this
            .actions
            .forEach(action => {
                let {path, resolve} = action;
                this.subscribe(path, resolve);
            });
    }

    destroy() {
        if (this.socket) {
            this
                .actions
                .forEach(action => {
                    let {path, resolve} = action;
                    this
                        .socket
                        .off(path, resolve);
                });
        }
    }
}

export default new SocketService();