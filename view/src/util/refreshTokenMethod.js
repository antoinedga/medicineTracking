import axios from 'axios';
import { state } from '../store/store'
var jwt = require('jsonwebtoken');

export const refreshToken = async (dispatch) => {
    console.log("called middleware in dashboard")
    const store = state.getState();
    const refreshToken = store.login.refresh;
    const token = store.login.token;

    if (token != null && token != undefined) {
        let decoded = jwt.decode(token)
        let expire = new Date(decoded.exp);
        if (Date.now() >= expire * 1000) {
            console.log("Token has Expired")
            console.log(refreshToken)
            return axios.post("/api/user/token", { refreshToken: refreshToken }).then(data => {
                console.log("Successfully got refresh token")
                dispatch(
                    {
                        type: "REFRESH_TOKEN", payload: {
                            token: data.data.content
                        }
                    }
                )
                console.log("reached")
                return Promise.resolve(data)
            }).catch(err => {
                console.log(err.response)
                return Promise.reject(err)
            })

        }
    } else {
        return Promise.resolve(true);
    }
}