import constant from '../actions/actionType/login'

const initialState = {
    name: "",
    login: false,
    loading: false,
    role: "",
    error: "",
    token: ""
}

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case constant.LOGIN_SENT: {
            return {
                ...state,
                loading: true
            }
        }
        case constant.LOGIN_SUCCESS: {
            return {
                ...state,
                loading: false,
                login: true,
                token: action.payload.token
            }
        }
        case constant.LOGIN_ERROR: {
            return {
                ...state,
                loading: false,
                login: false,
                error: action.payload.error
            }
        }
        case constant.LOGIN_LOGOUT: {
            return {
                ...state,
                login: false,
                token: "logged out"
            }
        }
        default:
            return state;
    }

}