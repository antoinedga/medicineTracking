import constant from '../actions/actionType/inventory'

const initialState = {
    location: [],
    selected: "",
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
        case constant.DONE: {
            return {
                ...state, loading: false
            }
        }
        case constant.INVENT_GET_ALL: {
            return {
                ...state,
                loading: false,
                location: action.payload.location,
                selected: action.payload.location[0]
            }
        }
        case constant.CHANGE_LOCATION: {
            return {
                ...state,
                selected: action.payload.selected
            }
        }
        case constant.INVENT_ERROR: {
            return {
                ...state,
                error: true,
                errorMsg: action.payload.errorMsg
            }
        }
        default:
            return state;
    }

}