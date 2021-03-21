import constant from './actionType/forgot'
import axios from 'axios'

export async function forgotAction(email, dispatch) {
    dispatch({ type: constant.FORGOT_SENT });

    return axios.post("http://localhost:8080/api/user/forget", { email })
        .then((res) => res.data).
        then(data => {
            console.log(data)
            if (data.response) {
                dispatch({ type: constant.FORGOT_SUCCESS, payload: {} })
                return true;
            } else {
                dispatch({ type: constant.FORGOT_ERROR, payload: { msg: data.message } })
                return false;
            }
        }).catch(error => {
            console.log(error.response);
            dispatch({ type: constant.FORGOT_ERROR, payload: { msg: error } })
            return false;
        })
}