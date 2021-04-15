import rootReducer from "./reducers"
import thunk from 'redux-thunk'
import { applyMiddleware, createStore, compose } from 'redux'
import axios from 'axios'
import Cookies from 'universal-cookie';

const middleware = [thunk];

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

