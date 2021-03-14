
import React, { useState } from "react";
import {
    Route,
    Redirect,
} from "react-router-dom";
import { useSelector } from 'react-redux'

const PrivateRoute = ({ children, ...rest }) => {
    let login = useSelector(state => state.login.login)
    let token = useSelector(state => state.login.token)
    return (
        <Route
            {...rest}
            render={() => {
                if (!login && token == "") {
                    return <Redirect to={{
                        pathname: "/login",
                        state: { msg: "not logged in" },
                        from: "/dashboard"
                    }} />;
                }

                return children;
            }}
        />
    );
}
export default PrivateRoute