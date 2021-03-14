import constant from '../actions/actionType/forgot'

const initialState = {
    success: false,
    error: "",
    loading: false,
}

export default function forgotReducer(state = initialState, action) {
    switch (action.type) {
        case constant.FORGOT_SENT: {
            return {
                ...state,
                loading: true,
                success: false,
            }
        }
        case constant.FORGOT_SUCCESS: {
            return {
                ...state,
                loading: false,
                success: true,
                error: ""
            }
        }
        case constant.FORGOT_ERROR: {
            return {
                ...state,
                success: false,
                loading: false,
                error: action.payload.msg,
            }
        }
        default:
            return state;
    }

}