export default class SocketService {
    constructor(host = 'localhost') {
        this.socket = window.io.connect();
    }

    next(id, payload) {
        // let encode = JSON.stringify(payload)
        this.socket.emit(id, payload);
    }

    subscribe(id, resolve) {
        this.socket.on(id, (payload) => {
            // let decoded = JSON.parse(data);
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