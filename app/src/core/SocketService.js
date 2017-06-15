class SocketService {
    constructor() {
        this.token = '';
        this.socket = window
            .io
            .connect();
    }

    emit(id, payload) {
        let token = this.token;
        let data = Object.assign({}, payload, {token});
        this
            .socket
            .emit(id, data);
    }

    subscribe(id, resolve) {
        this
            .socket
            .on(id, (payload) => {
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
            this
                .socket
                .off(id, actions[id]);
        });
    }

    setToken(token) {
        this.token = token;
    }

}

export default new SocketService();