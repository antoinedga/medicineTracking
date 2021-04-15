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
    // console.log("CONFIGL " + config.headers.Authorization)

    axios.post("http://localhost:8080/api/inventory/complete_paths", bodyParam, config)
        .then((res) => res.data).
        then(data => {
            dispatch({ type: constant.INVENT_GET_ALL, payload: { location: data.content } })
        }).catch((error) => {
            // 400+ errors normally if user doesnt exist
            //console.log(error.response)
            let msg = error.response?.data.message;
            dispatch({ type: constant.INVENT_ERROR, payload: { errorMsg: msg } })
        })
}

export async function addNewInventory(dispatch, newPath) {
    let state = store.state.getState();
    let bodyParam = {
        path: newPath.path + "/" + newPath.name
    }
    let config = {
        headers: { Authorization: `Bearer ${state.login.token.token}` }
    };
    return axios.post("/api/inventory", bodyParam, config)
        .then((res) => res.data).
        then(data => {
            return data;
        }).catch((error) => {
            console.log(error.response.data)
            dispatch({ type: constant.ADD_ERROR, payload: { msg: error.response.data.message } })
            return error.response.data;
        })
}