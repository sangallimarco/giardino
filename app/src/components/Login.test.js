import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import {UserStore} from '../stores';
import {Provider} from 'mobx-react';
// import {shallow} from 'enzyme';
import {MemoryRouter, Route} from 'react-router';

it('renders without crashing', () => {
    const stores = {
        UserStore
    };

    const div = document.createElement('div');
    ReactDOM.render(
        <MemoryRouter>
        <Provider {...stores}><Login stores={stores}/></Provider>
    </MemoryRouter>, div);

});
