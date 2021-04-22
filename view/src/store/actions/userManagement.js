import axios from 'axios'
import { refreshToken } from '../../util/refreshTokenMethod'

const store = require('../store')

export const inviteUser = async (dispatch, email) => {

    let temp = await refreshToken(dispatch)

    let state = store.state.getState();
    let bodyParam = {
        email: email,
    }

    let config = {
        headers: { Authorization: `Bearer ${state.login.token}` }
    };

    return axios.post("/api/admin/admin_invite", email)
        .then((res) => res.data).
        then(data => {
            return Promise.resolve(data)
        }).catch((error) => {
            return Promise.reject(error)
        })
}

export const getAllUsersByRole = async (dispatch) => {

    let temp = await refreshToken(dispatch)
    let state = store.state.getState();

    let config = {
        headers: { Authorization: `Bearer ${state.login.token}` }
    };

    return axios.get("/api/role/user", config)
        .then((res) => res.data).
        then(data => {
            return Promise.resolve(data)
        }).catch((error) => {
            return Promise.reject(error)
        })
}

export const editUserForRoles = async (dispatch, data) => {

    let temp = await refreshToken(dispatch)
    let state = store.state.getState();

    let config = {
        headers: { Authorization: `Bearer ${state.login.token}` }
    };
    return axios.post("/api/role/user", data, config)
        .then(res => {
            console.log(res)
            return Promise.resolve(res.data)
        }).catch(err => {
            console.log(err.response)
            return Promise.reject(err.response)
        })
}
