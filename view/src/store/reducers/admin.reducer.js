
import constants from '../actions/actionType/admin'

const initialState = {
    success: false,
    error: "",
    loading: false,
    roles: [],
    resource: [],
    paths: [],
    subPaths: [],
    actions: [],
}

export default function AdminReducer(state = initialState, action) {
    switch (action.type) {
        case constants.ADMIN_LOADING: {
            return { ...state, loading: true }
        }
        case constants.ADMIN_SUCCESS: {
            return { ...state, loading: false }

        }
        case constants.ADMIN_ROLES: {
            return {
                ...state,
                loading: false,
                roles: action.payload
            }
        }
        case constants.ADMIN_ERROR: {
            return {
                ...state,
                loading: false,
            }
        }
        case constants.ADMIN_CREATE_CONFIG: {
            return {
                ...state,
                loading: false,
                resource: action.payload.resource,
                actions: action.payload.actions,
                paths: action.payload.paths
            }
        }
        default:
            return state;
    }

}