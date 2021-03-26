import constant from '../actions/actionType/order'

const initialState = {
    orders: [],
    loading: false,
    errorMsg: ""
}

export default function orderReducer(state = initialState, action) {
    switch (action.type) {
        case constant.ORDER_LOADING: {
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        }
        case constant.ORDER_DONE: {
            return {
                ...state,
                loading: false,
                errorMsg: ""
            }
        }
        case constant.ORDER_PATH_SET: {
            return {
                ...state,
                orders: action.payload.orders
            }
        }
        default:
            return state;
    }

}