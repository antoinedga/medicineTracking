import constant from './actionType/login'
import axios from 'axios'
import Cookies from 'universal-cookie';
import constants from './actionType/order';
const cookies = new Cookies();
var store = require("../store");

export const getOrders = (dispatch) => {
    let state = store.state.getState();

    let config = {
        headers: { Authorization: `Bearer ${state.login.token}` }
    };

    let bodyParam = {
        path: state.inventory.selected,
    }

    return axios.post("/api/order/by_path/recursive", bodyParam, config)
        .then((res) => res.data).
        then(data => {
            console.log(data.Content)
            dispatch({ type: constants.ORDER_PATH_SET, payload: { orders: data.Content } })
            return data
        }).catch((error) => {
            return error
        })
}

