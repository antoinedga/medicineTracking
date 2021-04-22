import constant from './actionType/register'
import axios from 'axios'

export const registration = async (formData, dispatch) => {
    dispatch({ type: constant.REG_SENT });
    return axios.post(`http://localhost:8080/api/user/signup/${formData.token}`, formData)
        .then((res) => res.data).
        then(data => {
            if (data.response) {
                dispatch({ type: constant.REG_SUCCESS })
            }
            else {
                dispatch({ type: constant.REG_ERROR, payload: {} })
            }
            return Promise.resolve(data)
        }).catch(error => {
            return Promise.reject(error)
        })
}
