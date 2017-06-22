import {action, observable, computed} from "mobx";
import jwtDecode from 'jwt-decode';

class UserModel {
    @observable token = localStorage.getItem('token');

    @action
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    @computed
    get details() {
        return this.token ? jwtDecode(this.token) : {};
    }
}

export default UserModel;