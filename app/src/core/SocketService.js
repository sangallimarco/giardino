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

}