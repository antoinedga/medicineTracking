
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/login"
import NoMatch from "./components/noMatch/noMatch";
import Register from "./components/register"
import Dashboard from "./components/dashboard"
import Password from './components/forgotpassword'
import ResetPassword from './components/resetPassword'
import PrivateRoute from './components/privateRouter.js'


import { Provider } from 'react-redux'
import EditView from './components/dashboard/pages/orders/EditOrder'

const Store = require('./store/store')
let store = null;

if (window?.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    store = Store.withDevTool();
} else {
    store = Store.withoutDevTool();
}


function App() {
    return (
        <Provider store={store}>
            <Router>
                <Switch>

                    <Route exact path="/" component={Login}>
                    </Route>

                    <Route path="/signup/:token?" component={Register}>
                    </Route>

                    <Route exact path="/login" component={Login}>
                    </Route>

                    <Route exact path="/password_reset" component={Password}>
                    </Route>

                    <Route exact path="/reset/:token?" component={ResetPassword}
                    ></Route>

                    <PrivateRoute path="/dashboard">
                        <Dashboard />
                    </PrivateRoute>

                    <Route path="*" component={NoMatch}>
                    </Route>

                </Switch>
            </Router>
        </Provider >
    );
}

export default App;
