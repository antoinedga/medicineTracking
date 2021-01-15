
import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from "./components/login"
import NoMatch from "./components/noMatch/noMatch";
import Register from "./components/register"

function App() {
  return (
      <Router>
            <Switch>
                <Route exact path="/">
                    <Login/>
                </Route>

                <Route exact path="/login">
                    <Login/>
                </Route>

                <Route exact path="/register">
                    <Register/>
                </Route>

                <Route path="/dashboard">

                </Route>

                <Route path="*">
                    <NoMatch/>
                </Route>

            </Switch>
      </Router>
  );
}

export default App;
