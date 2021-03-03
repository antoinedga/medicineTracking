import constant from './actionType/login'
import axios from 'axios'

export const loginPayload = (email, password, dispatch) => {
    console.log("is this working?")
    dispatch({ type: constant.LOGIN_SENT });
    console.log("is this working?")
    axios.post("/login").then(res => res.json()).then(data => {
        console.log(data)
        dispatch({ type: constant.LOGIN_SUCCESS, payload: {} })
    }).catch(error => {
        console.log(error);
        dispatch({ type: constant.LOGIN_ERROR, payload: {} })
    })
}
