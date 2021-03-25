import constant from './actionType/login'
import axios from 'axios'
import Cookies from 'universal-cookie';

export const loginPayload = (email, password, dispatch) => {
    dispatch({ type: constant.LOGIN_SENT });

    axios.post("http://localhost:8080/api/user/login", { email, password })
        .then((res) => res.data).
        then(data => {
            console.log(data)
            if (data.response) {

                localStorage.setItem('token', data.Content.token);
                dispatch({
                    type: constant.LOGIN_SUCCESS, payload: {
                        token: data.Content.token,
                        refresh: data.Content.refreshToken
                    }
                })
            } // user exist but incorrect credentials 
            else {
                dispatch({ type: constant.LOGIN_ERROR, payload: { error: "INCORRECT CREDENTIAL" } })
            }

        }).catch((error) => {
            // 400+ errors normally if user doesnt exist
            let msg = error.response?.data?.message;
            console.log(error.response)
            dispatch({ type: constant.LOGIN_ERROR, payload: { error: msg } })
        })
}

export const logoutPayload = (dispatch) => {
    localStorage.clear();
    dispatch({ type: constant.LOGIN_LOGOUT })
}
