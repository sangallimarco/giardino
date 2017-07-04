import {action, observable, computed} from "mobx";
import jwtDecode from 'jwt-decode';

class UserModel {
    @observable user = {};
    @observable token = '';

    constructor() {
        let token = localStorage.getItem('token');
        this.setToken(token);
    }

    @action
    setToken(token) {
        this.token = token;
        localStorage.getItem('token');
        let user = this.getPayload(token);
        this.user = user;
    }

    getPayload() {
        return this.token
            ? jwtDecode(this.token)
            : {};
    }

    @computed
    get email() {
        let {email} = this.user;
        return email;
    }
}

export default UserModel;