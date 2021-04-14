import { combineReducers } from 'redux'
import loginReducer from "./login.reducer"
import forgotReducer from './forgot.reducer'
import inventoryReducer from './inventory.reducer'
import resetReducer from './reset.reducer'
import orderReducer from './order.reducer'
import registerReducer from './register.reducer'
import AdminReducer from './admin.reducer'
export default combineReducers(
    {
        login: loginReducer,
        forgot: forgotReducer,
        inventory: inventoryReducer,
        reset: resetReducer,
        orders: orderReducer,
        register: registerReducer,
        admin: AdminReducer
    })