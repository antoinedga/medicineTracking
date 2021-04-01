import axios from 'axios'
import constants from './actionType/order';
var store = require("../store");

export const getOrders = (dispatch) => {
    let state = store.state.getState();

    let config = {
        headers: { Authorization: `Bearer ${state.login.token}` }
    };

    let bodyParam = {
        path: state.inventory.selected,
    }

    return axios.post("http://localhost:8080/api/order/by_path/recursive", bodyParam, config)
        .then((res) => res.data)
        .then(data => {
            console.log(data.Content)
            dispatch({ type: constants.ORDER_PATH_SET, payload: { orders: data.Content } })
            return data
        }).catch((error) => {
            return error
        })
}

export const deleteOrder = async (dispatch, orderId) => {
    let state = store.state.getState();

    let config = {
        headers: { Authorization: `Bearer ${state.login.token}` }
    };
    console.log(config)

    let bodyParam = {
        _id: orderId,
    }
    dispatch({ type: constants.ORDER_LOADING })

    return axios.delete("http://localhost:8080/api/order/by_id", {
        headers: {
            Authorization: `Bearer ${state.login.token}`
        }, data: {
            _id: orderId
        }
    }
    )
        .then((res) => res.data).
        then(data => {
            return Promise.resolve(data)
        }).catch((error) => {

            return Promise.reject(error)
        })
}

export const getOrderByID = async (dispatch, orderId) => {
    let state = store.state.getState();

    let config = {
        headers: { Authorization: `Bearer ${state.login.token}` }
    };
    // console.log(config)

    let bodyParam = {
        _id: orderId,
    }
    dispatch({ type: constants.ORDER_LOADING })

    return axios.post("http://localhost:8080/api/order/by_id", bodyParam, config)
        .then((res) => res.data).
        then(data => {
            console.log(data)
            return Promise.resolve(data)
        }).catch((error) => {

            return Promise.reject(error)
        })
}

export const uploadOrder = async (dispatch, file, orderNum) => {
    let state = store.state.getState();
    var formData = new FormData();
    let config = {
        headers: {
            Authorization: `Bearer ${state.login.token}`,
            ContentType: 'multipart/form-data'
        }
    };

    formData.append('orderNumber', orderNum)
    formData.append('file', file);

    return axios.post("/api/order/upload", formData, config).then(data => {

    }).catch(error => {

    })
}
