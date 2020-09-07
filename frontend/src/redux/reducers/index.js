/**
 * HOLDS THE ROOT REDUCER
 * The root reducer combines all reducers 
 * */ 
import { combineReducers } from 'redux'
import userReducer from './userReducer'

export default combineReducers({
    user: userReducer
});