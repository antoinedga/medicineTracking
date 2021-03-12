
import React from "react";
import {
    Route,
    Redirect,
} from "react-router-dom";


const PrivateRoute = ({ child, ...rest }) => {
    let login = useSelector(state => state.loginReducer.login)
    let token = useSelector(state => state.loginReducer.token)
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