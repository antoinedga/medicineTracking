import constant from '../actions/actionType/inventory'

const initialState = {
    location: [],
    inventory: [],
    loading: false,
    errorMsg: "",
    error: false,
}

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case constant.LOADING: {
            return {
                ...state,
                loading: true
            }
        }
        case constant.INVENT_GET_ALL: {
            return {
                ...state,
                loading: false,
                location: action.payload,
                inventory: action.payload.location
            }
        }
        default:
            return state;
    }

}