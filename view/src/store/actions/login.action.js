import constant from './actionType/login'
import axios from 'axios'
import Cookies from 'universal-cookie';
const cookies = new Cookies();
var jwt = require('jsonwebtoken');

export const loginPayload = async (email, password, dispatch) => {
    dispatch({ type: constant.LOGIN_SENT });

    return axios.post("http://localhost:8080/api/user/login", { email, password })
        .then((res) => res.data)
        .then(data => {

            if (data.response) {
                cookies.set('token', data.content.token, { path: "/", expires: new Date(Date.now() + (60 * 1000 * 5)) })
                cookies.set('refreshToken', data.content.refresh, { path: "/", expires: new Date(Date.now() + (60 * 1000 * 60)) })

                //sessionStorage.setItem('token', data.content.token);
                let decoded = jwt.decode(data.content.token)
                console.log()
                cookies.set('name', decoded.user.name, { path: "/", expires: new Date(Date.now() + (60 * 1000 * 30)) })

                dispatch({
                    type: constant.LOGIN_SUCCESS, payload: {
                        token: data.content.token,
                        refresh: data.content.refreshToken,
                        name: decoded.user.name
                    }
                })
                return Promise.resolve(data)
            } // user exist but incorrect credentials 
            else {
                dispatch({ type: constant.LOGIN_ERROR, payload: { error: "INCORRECT CREDENTIAL" } })
                return Promise.reject(data)
            }

        }).catch((error) => {
            // 400+ errors normally if user doesnt exist
            let msg = error.response?.data?.message;
            console.log(error.response)
            dispatch({ type: constant.LOGIN_ERROR, payload: { error: msg } })
            return Promise.reject(error)
        })
}

export const logoutPayload = (dispatch) => {
    cookies.remove("token", { path: '/' });
    // console.log(cookies.get("token"))
    dispatch({ type: constant.LOGIN_LOGOUT })
}


