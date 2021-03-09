import constant from './actionType/login'
import axios from 'axios'

export const loginPayload = (email, password, dispatch) => {
    dispatch({ type: constant.LOGIN_SENT });

    axios.post("http://localhost:8080/api/user/login", { email, password })
        .then((res) => res.data).
        then(data => {
            console.log(data)
            dispatch({ type: constant.LOGIN_SUCCESS, payload: { token: data.content } })

        }).catch(error => {
            console.log(error);
            dispatch({ type: constant.LOGIN_ERROR, payload: {} })
        })
}
