import {action, observable, computed} from "mobx";
import {SocketService} from '../core';

class CommandsModel {
    @observable state = false;
    @observable queued = 0;
    @observable items = 0;

    init() {
        const actions = {
            '/status': payload => {
                let {status} = payload;
                this.setStatus(status);
            },
            '/queue': payload => {
                let {queued, items} = payload;
                this.setQueue(items, queued);  
            },
            '/end': payload => {
                this.setStatus(false);
            }
        };

        SocketService.dispatch(actions);
    }

    @action
    setStatus(value) {
        this.status = value;
    }

    @action
    setQueue(items, queued) {
        this.items = items;
        this.queued = queued;
    }

    start() {
        SocketService.emit('/start', {status: true});
    }

    stop() {
        SocketService.emit('/stop', {status: false});
    }

    @computed
    get percent() {
        return ((this.items - this.queued) / this.items) * 100;
    }

    @computed
    get icon() {
        return this.items > 0 ? 'sync' : 'caret-right';
    }
}

export default CommandsModel;