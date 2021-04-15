import rootReducer from "./reducers"
import thunk from 'redux-thunk'
import { applyMiddleware, createStore, compose } from 'redux'
import axios from 'axios'
import Cookies from 'universal-cookie';
const cookies = new Cookies();
let lastCheck = null;
const customMiddleware = ({ getState, dispatch }) => next => action => {
  const state = getState();
  const refreshToken = state.login.refresh;
  console.log(action)
  if (action.type == "LOGIN_SUCCESS") {
    lastCheck = new Date();
    console.log("set timer")
    next(action);
  } else {

    if (Date.now() - lastCheck.getTime() >= .1 * 60 * 1000) {
      console.log("its old")
      axios.post("/api/user/token", { refreshToken: refreshToken }).then(data => {
        lastCheck = new Date()
        dispatch({
          type: "REFRESH_TOKEN", payload: {
            token: data.Content
          }
        });
      }).finally(() => {
        next(action);
      })
    } else {
      next(action);
    }
  }

  //next(action);
}

const middleware = [customMiddleware, thunk];

export var state = null;
export function withDevTool() {
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  return state = createStore(
    rootReducer, composeEnhancer(applyMiddleware(...middleware))

  );
}

export function withoutDevTool() {

  return state = createStore(
    rootReducer, applyMiddleware(...middleware)

  );
}

