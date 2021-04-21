import axios from 'axios'
import constants from './actionType/order';
import fs from 'fs'
import { refreshToken } from '../../util/refreshTokenMethod';
var store = require("../store");

export const getOrders = async (dispatch) => {

    let temp = await refreshToken(dispatch)

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
            console.log(data.content)
            dispatch({ type: constants.ORDER_PATH_SET, payload: { orders: data.content } })
            return data
        }).catch((error) => {
            return error
        })
}

export const deleteOrder = async (dispatch, orderId) => {

    let temp = await refreshToken(dispatch)

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
        .then((res) => res.data)
        .then(data => {
            return Promise.resolve(data)
        }).catch((error) => {

            return Promise.reject(error)
        })
}

export const getOrderByID = async (dispatch, orderId) => {

    let temp = await refreshToken(dispatch)

    let state = store.state.getState();
    let config = {
        //headers: { Authorization: `Bearer ${token}` }
        headers: { Authorization: `Bearer ${state.login.token}` }
    };
    // console.log(config)

    let bodyParam = {
        _id: orderId,
    }
    dispatch({ type: constants.ORDER_LOADING })

    return axios.post("http://localhost:8080/api/order/by_id", bodyParam, config)
        .then((res) => res.data)
        .then(data => {
            console.log(data)
            return Promise.resolve(data)
        }).catch((error) => {
            return Promise.reject({
                response: false,
                message: "Error while calling the api",
                content: error
            })
        })
}

export const getEachesUnits = async (dispatch) => {
    let state = store.state.getState();
    const token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjExMTExMTExMTExMTExMTExMTExMTExMSIsIm5hbWUiOiJhZG1pbiJ9LCJhY2Nlc3MiOnsiY29uZmlnIjp7ImNyZWF0ZSI6eyIvIjp7fX0sInJlYWQiOnsiLyI6e319LCJ1cGRhdGUiOnsiLyI6e319LCJkZWxldGUiOnsiLyI6e319LCJncmFudCI6eyIvIjp7fX19LCJpbnZpdGF0aW9uIjp7ImNyZWF0ZSI6eyIvIjp7fX0sInJlYWQiOnsiLyI6e319LCJ1cGRhdGUiOnsiLyI6e319LCJkZWxldGUiOnsiLyI6e319LCJncmFudCI6eyIvIjp7fX19LCJpbnZlbnRvcnkiOnsiY3JlYXRlIjp7Ii8iOnt9fSwicmVhZCI6eyIvIjp7fX0sInVwZGF0ZSI6eyIvIjp7fX0sImRlbGV0ZSI6eyIvIjp7fX0sImdyYW50Ijp7Ii8iOnt9fX0sIml0ZW0iOnsiY3JlYXRlIjp7Ii8iOnt9fSwicmVhZCI6eyIvIjp7fX0sInVwZGF0ZSI6eyIvIjp7fX0sImRlbGV0ZSI6eyIvIjp7fX0sImdyYW50Ijp7Ii8iOnt9fX0sIm9yZGVyIjp7ImNyZWF0ZSI6eyIvIjp7fX0sInJlYWQiOnsiLyI6e319LCJ1cGRhdGUiOnsiLyI6e319LCJkZWxldGUiOnsiLyI6e319LCJncmFudCI6eyIvIjp7fX19LCJwcm9kdWN0Ijp7ImNyZWF0ZSI6eyIvIjp7fX0sInJlYWQiOnsiLyI6e319LCJ1cGRhdGUiOnsiLyI6e319LCJkZWxldGUiOnsiLyI6e319LCJncmFudCI6eyIvIjp7fX19LCJyb2xlIjp7ImNyZWF0ZSI6eyIvIjp7fX0sInJlYWQiOnsiLyI6e319LCJ1cGRhdGUiOnsiLyI6e319LCJkZWxldGUiOnsiLyI6e319LCJncmFudCI6eyIvIjp7fX19LCJlYWNoZXMiOnsiY3JlYXRlIjp7Ii8iOnt9fSwicmVhZCI6eyIvIjp7fX0sInVwZGF0ZSI6eyIvIjp7fX0sImRlbGV0ZSI6eyIvIjp7fX0sImdyYW50Ijp7Ii8iOnt9fX19LCJpYXQiOjE2MTgzNzAzNDUsImV4cCI6MTYyMDk2MjM0NX0.p7_GqcgteQlaS1Eed6HgxQEywGxEyjizJKe-L7ePdyw"
    let config = {
        headers: { Authorization: `Bearer ${token}` }
        //headers: { Authorization: `Bearer ${state.login.token}` }
    };
    // console.log(config)
    dispatch({ type: constants.ORDER_LOADING })

    return axios.get("http://localhost:8080/api/product/units", config)
        .then((res) => res.data)
        .then(data => {
            console.log(data)
            return Promise.resolve(data)
        }).catch((error) => {
            return Promise.reject({
                response: false,
                message: "Error while calling the api",
                content: error
                })
        })
}

export const getConfig = async (dispatch, configName) => {
    let temp = await refreshToken(dispatch)

    let state = store.state.getState();
    let config = {
        //headers: { Authorization: `Bearer ${token}` }
        headers: { Authorization: `Bearer ${state.login.token}` }
    };
    // console.log(config)

    dispatch({ type: constants.ORDER_LOADING })

    return axios.get(`http://localhost:8080/api/config/${configName}`, config)
        .then((res) => res.data)
        .then(data => {
            console.log(data)
            return Promise.resolve(data)
        }).catch((error) => {
            return Promise.reject({
                response: false,
                message: "Error while calling the api",
                content: error
            })
        })
}

export const uploadOrder = async (dispatch, file, orderNum) => {

    let temp = await refreshToken(dispatch)

    let state = store.state.getState();
    var data = new FormData();
    data.append('orderData', file[0]);
    data.append('file', file[0])
    console.log(file)
    data.append('orderNumber', orderNum);
    var config = {
        method: 'post',
        url: '/api/order/upload',
        headers: {
            'Authorization':
                `Bearer ${state.login.token}`,
            'Content-Type': 'multipart/form-data'

        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            return Promise.resolve(response.data)
        })
        .catch(function (error) {
            console.log(error.response);
            return Promise.reject(error.data)
        });
}
