import constant from '../actions/actionType/register'

const initialState = {
    loading: false,
    error: "",
    success: false
}

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case constant.REG_SENT: {
            return {
                ...state,
                loading: true,

            }
        }
        case constant.REG_SUCCESS: {
            return {
                ...state,
                loading: false,
                success: true
            }
        }
        case constant.REG_ERROR: {
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                success: false
            }
        }
        default:
            return state;
    }

}