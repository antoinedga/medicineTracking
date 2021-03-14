import constant from './actionType/forgot'
import axios from 'axios'

export function forgotAction(email, dispatch) {
    dispatch({ type: constant.FORGOT_SENT });

    axios.post("http://localhost:8080/api/user/forget", { email })
        .then((res) => res.data).
        then(data => {
            console.log(data)
            if (data.response) {
                dispatch({ type: constant.FORGOT_SUCCESS, payload: {} })
            } else {
                dispatch({ type: constant.FORGOT_ERROR, payload: { msg: data.message } })
            }
        }).catch(error => {
            console.log(error.response);
            dispatch({ type: constant.FORGOT_ERROR, payload: { msg: error } })
        })
}