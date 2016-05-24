/**
 * Created by orel- on 06/Dec/15.
 */
import React from 'react';
import Router from 'react-router';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';

// This one is pure service module. It injects our markup into the page, shouldn't be changed

let history = createBrowserHistory();

ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById('app'));
