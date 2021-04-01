import axios from 'axios'
const store = require('../store')

export const inviteUser = (email) => {
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
