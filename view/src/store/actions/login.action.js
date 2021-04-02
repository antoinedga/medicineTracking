import constant from './actionType/login'
import axios from 'axios'
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const loginPayload = async (email, password, dispatch) => {
    dispatch({ type: constant.LOGIN_SENT });

    return axios.post("http://localhost:8080/api/user/login", { email, password })
        .then((res) => res.data).
        then(data => {
            console.log(data)
            if (data.response) {
                cookies.set('token', data.Content.token, { path: "/", expires: new Date(Date.now() + (60 * 1000 * 30)) })
                //sessionStorage.setItem('token', data.Content.token);

                dispatch({
                    type: constant.LOGIN_SUCCESS, payload: {
                        token: data.Content.token,
                        refresh: data.Content.refreshToken
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
    console.log(cookies.get("token"))
    dispatch({ type: constant.LOGIN_LOGOUT })
}
