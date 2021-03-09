
import React from "react";
import { applyMiddleware, createStore, compose } from 'redux'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/login"
import NoMatch from "./components/noMatch/noMatch";
import Register from "./components/register"
import Dashboard from "./components/dashboard"
import Password from './components/forgotpassword'
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from "./store/reducers"

const initial = require("./store/initialState")
const middleware = [thunk];
let store = null;

if (window?.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(
        rootReducer, initial, composeEnhancer(applyMiddleware(thunk))

    );
} else {
    store = createStore(
        rootReducer, initial, applyMiddleware(thunk)

    );
}

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Switch>

                    <Route exact path="/">
                        <Login />
                    </Route>

                    <Route path="/signup/:token?">
                        <Register />
                    </Route>

                    <Route exact path="/login">
                        <Login />
                    </Route>

                    <Route exact path="/password_reset">
                        <Password />
                    </Route>

                    <Route path="/dashboard">
                        <Dashboard />
                    </Route>

                    <Route path="*">
                        <NoMatch />
                    </Route>

                </Switch>
            </Router>
        </Provider >
    );
}

export default App;
