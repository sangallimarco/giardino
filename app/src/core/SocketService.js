export default class SocketService {
    constructor() {
        this.socket = window.io.connect();
    }

    next(id, payload) {
        this.socket.emit(id, payload);
    }

    subscribe(id, resolve) {
        this.socket.on(id, (payload) => {
            resolve(payload);
        });
    }

    dispatch(actions) {
        let keys = Object.keys(actions);

        keys.forEach(id => {
            let resolve = actions[id];
            this.subscribe(id, resolve);
        });
    }

    destroy(actions) {
        let keys = Object.keys(actions);

        keys.forEach(id => {
            this.socket.off(id, actions[id]);
        });
    }

}