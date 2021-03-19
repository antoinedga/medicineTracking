import constant from './actionType/inventory'
import axios from 'axios'
var store = require("../store");

export const getAllPath = (dispatch) => {
    let state = store.state.getState();
    let bodyParam = {
        resource: "inventory",
        action: "read"
    }

    let config = {
        headers: { Authorization: `Bearer ${state.login.token}` }
    };

    axios.post("http://localhost:8080/api/inventory/complete_paths", bodyParam, config)
        .then((res) => res.data).
        then(data => {
            console.log(data)

        }).catch((error) => {
            // 400+ errors normally if user doesnt exist
            let msg = error.response.data.message;
            console.log(error.response)
            dispatch({ type: constant.LOGIN_ERROR, payload: { error: msg } })
        })
}