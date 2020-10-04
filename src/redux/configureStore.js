import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducersDucks from './ducks';

const reducer = combineReducers(reducersDucks);
let store = createStore(reducer, applyMiddleware(thunkMiddleware));
export {store};
