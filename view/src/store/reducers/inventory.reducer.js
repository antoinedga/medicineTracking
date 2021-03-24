import constant from '../actions/actionType/inventory'

const initialState = {
    location: [],
    selected: "",
    inventory: [],
    loading: false,
    add_loading: false,
    errorMsg: "",
    error: false,
    add_error: "",
    add_success: false
}

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case constant.LOADING: {
            return {
                ...state,
                loading: true,
                errorMsg: ""
            }
        }
        case constant.DONE: {
            return {
                ...state,
                loading: false
            }
        }
        case constant.INVENT_GET_ALL: {
            return {
                ...state,
                loading: false,
                location: action.payload.location,
                selected: action.payload.location[0],
                errorMsg: ""
            }
        }
        case constant.CHANGE_LOCATION: {
            return {
                ...state,
                selected: action.payload.selected,
                errorMsg: ""
            }
        }
        case constant.INVENT_ERROR: {
            return {
                ...state,
                error: true,
                errorMsg: action.payload.errorMsg
            }
        }
        case constant.INVENT_ADD: {
            return {
                ...state,
                error: false,
                errorMsg: ""
            }
        }
        case constant.ADD_LOADING: {
            return {
                ...state,
                add_loading: true,
            }
        }
        case constant.ADD_DONE: {
            return {
                ...state,
                add_loading: false,
            }
        }
        case constant.ADD_ERROR: {
            console.log(action.payload)
            return {
                ...state,
                add_error: action.payload.msg
            }
        }

        default:
            return state;
    }

}