
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
import initial from "./store/initialState"

const middleware = [thunk];
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    rootReducer, initial
    + window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
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
