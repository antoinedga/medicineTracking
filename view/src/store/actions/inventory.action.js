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
        headers: { Authorization: `Bearer ${state.login.token.token}` }
    };

    console.log(state.login.token.token)

    axios.post("http://localhost:8080/api/inventory/complete_paths", bodyParam, config)
        .then((res) => res.data).
        then(data => {
            console.log(data)
            dispatch({ type: constant.INVENT_GET_ALL, payload: { location: data.Content } })

        }).catch((error) => {
            // 400+ errors normally if user doesnt exist
            console.log(error)
            let msg = error.response?.data.message;
            dispatch({ type: constant.INVENT_ERROR, payload: { errorMsg: msg } })
        })
}