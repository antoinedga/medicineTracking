
import React from "react";
import Cookies from 'universal-cookie';
import {
    Route,
    Redirect,
} from "react-router-dom";

const cookies = new Cookies();

const verifyCookie = (cookies) => {

}


const PrivateRoute = ({child, ...rest }) => {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                cookies.get('access_token') !== null ||
                cookies.get('access_token') !== undefined
                    ? (
                    child) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                        }}
                    />
                )
            }
        />
    );
}
export default PrivateRoute