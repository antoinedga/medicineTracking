// import constant from './actionType/register'
import axios from 'axios'

export const getAllRoles = async (dispatch) => {

    return axios.post(`http://localhost:8080/api/role/`, formData)
        .then((res) => res.data).
        then(data => {

            return Promise.resolve(data)
        }).catch(error => {

            return Promise.reject(error)
        })
}
