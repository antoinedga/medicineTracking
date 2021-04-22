import axios from 'axios'
const constant = require('./actionType/reset')

var store = require("../store");

export async function sendResetPassword(dispatch, data) {

    let token = data.token
    let bodyParam = {
        new_password: data.new_password,
        confirm_password: data.confirm_password
    }

    let result = axios.post(`/api/user/reset/${token}`, bodyParam)
        .then((res) => res.data).
        then(data => {
            return data
        }).catch((error) => {
            // 400+ errors normally if user doesnt exist
            let msg = error.response?.data.message;
            return error
        });
    return result
}