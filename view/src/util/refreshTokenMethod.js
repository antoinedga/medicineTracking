import axios from 'axios';
import { useDispatch } from 'react-redux'
import { state } from '../store/store'
var jwt = require('jsonwebtoken');

export const refreshToken = async (dispatch) => {
    console.log("called middleware in dashboard")
    const store = state.getState();
    const refreshToken = store.login.refresh;
    const token = store.login.token;

    if (token != null || token != undefined) {
        let decoded = jwt.decode(token)
        let expire = new Date(decoded.exp * 1000);
        console.log("expires " + expire)
        console.log(new Date(Date.now()))
        if (Date.now() >= expire) {
            console.log("Token has Expired")

            return axios.post("/api/user/token", { refreshToken: refreshToken }).then(data => {
                console.log('called token')
                dispatch(
                    {
                        type: "REFRESH_TOKEN", payload: {
                            token: data.Content
                        }
                    }
                )
            })

        }
    } else {
        return Promise.resolve();
    }
}