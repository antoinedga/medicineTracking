// import constant from './actionType/register'
import axios from 'axios'
var store = require("../store");

export const getAllRoles = async () => {
    let state = store.state.getState();
    let body = {
        path: state.inventory.selected,
    }

    let config = {
        headers: {
            'Authorization':
                `Bearer ${state.login.token}`,
        }
    }
    return axios.post(`http://localhost:8080/api/role/by_path/recursive`, body, config)
        .then((res) => res.data).
        then(data => {
            return Promise.resolve(data)
        }).catch(error => {

            return Promise.reject(error)
        })
}


export const deleteRole = async (roleID) => {
    let state = store.state.getState();

    return axios.delete(`http://localhost:8080/api/role/by_id`, {
        headers: {
            Authorization: `Bearer ${state.login.token}`
        }, data: {
            _id: roleID
        }
    })
        .then((res) => res.data).
        then(data => {
            return Promise.resolve(data)
        }).catch(error => {
            console.log(error.response)
            return Promise.reject(error)
        })
}

export const createNewRoleConfig = async () => {
    let state = store.state.getState();
    let bodyParam = {
        action: "create",
        resource: "role",

    }
    let config = {
        headers: { Authorization: `Bearer ${state.login.token}` }
    };
    const getAllPath = axios.post("http://localhost:8080/api/inventory/complete_paths", bodyParam, config);
    const resource = axios.get("http://localhost:8080/api/role/resources", config)
    const actions = axios.get("http://localhost:8080/api/role/actions", config)

    return Promise.all([getAllPath, resource, actions]).then((values) => {
        let temp = [values[0].data.content, values[1].data.content, values[2].data.content]
        return temp;
    })
}

export const getSubInventory = async (path) => {
    let state = store.state.getState();
    let body = {
        path: path,
        action: 'create',
        resource: 'role'
    }

    let config = {
        headers: {
            'Authorization':
                `Bearer ${state.login.token}`,
        }
    }
    return axios.post(`http://localhost:8080/api/inventory/paths`, body, config)
        .then((res) => res.data).
        then(data => {
            let content = data.content
            let str = path.substring(1, path.length)
            let parse = str.split("/")
            let current = content[parse[0]]
            for (var i = 1; i < parse.length; i++) {
                current = current.next[parse[i]]
            }
            console.log(Object.keys(current.next))
            return Promise.resolve(data)
        }).catch(error => {
            console.log(error)
            return Promise.reject(error)
        })
}

export const submitCreateRole = async (roleData) => {
    let state = store.state.getState();
    let body = roleData

    let config = {
        headers: {
            'Authorization':
                `Bearer ${state.login.token}`,
        }
    }
    return axios.post(`http://localhost:8080/api/role`, body, config)
        .then((res) => res.data).
        then(data => {
            console.log(data)
            return Promise.resolve(data)
        }).catch(error => {
            console.log(error)
            return Promise.reject(error)
        })
}