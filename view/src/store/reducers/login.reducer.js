import constant from '../actions/actionType/login'

const initialState = {
    name: "",
    location: [],
    selectedInventory: "",
    inventory: [],
    orders: [],
    login: false,
    loading: false,
    role: ""
}

export default function loginReducer(state = initialState, action) {

    console.log("reducer")
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
            }
        }
        case constant.LOGIN_ERROR: {
            return {
                ...state,
                loading: false,
                login: false,
            }
        }
        default:
            return state;
    }

}