import { constant } from '../actions/actionType/reset'

const initialState = {
    success: false,
    error: "",
    loading: false,
}


export default function resetReducer(state = initialState, action) {
    console.log("das")
    console.log(constant)
    switch (action.type) {
        case constant.RESET_SENT: {
            console.log("hello")
            return {
                ...state,
                loading: true,
            }
        }
        case constant.RESET_SUCCESS: {
            return {
                ...state,
                loading: false,
                success: true,
            }
        }
        case constant.RESET_FAILURE: {
            return {
                ...state,
                success: false,
                loading: false,
            }
        }
        default:
            return state;
    }

}