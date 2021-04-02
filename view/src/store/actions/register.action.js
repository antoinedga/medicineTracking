import constant from './actionType/register'
import axios from 'axios'

export const registration = async (formData, dispatch) => {
    dispatch({ type: constant.REG_SENT });
    return axios.post("http://localhost:8080/api/user/login", formData)
        .then((res) => res.data).
        then(data => {
            console.log(data)
            dispatch({ type: constant.REG_SUCCESS })
            return Promise.resolve(data)
        }).catch(error => {
            console.log(error);
            dispatch({ type: constant.REG_ERROR, payload: {} })
            return Promise.reject(error)
        })
}
