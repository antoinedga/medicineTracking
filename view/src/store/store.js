import rootReducer from "./reducers"
import thunk from 'redux-thunk'
import { applyMiddleware, createStore, compose } from 'redux'

const middleware = [thunk];
export var state = null;
export function withDevTool() {
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  return state = createStore(
    rootReducer, composeEnhancer(applyMiddleware(thunk))

  );
}

export function withoutDevTool() {

  return state = createStore(
    rootReducer, applyMiddleware(thunk)

  );
}


