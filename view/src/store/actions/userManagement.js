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
