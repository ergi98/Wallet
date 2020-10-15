// Actions
import { 
    LOG_IN, 
    LOG_OUT, 
    UPDATE_USER_AUTH,
    GET_PORTFOLIOS,
    UPDATE_PORTFOLIOS,
} from '../actions/types'

// Axios
import axios from 'axios'

export const logIn = (event) => async (dispatch) => {

    try {
        let res = await axios.post(`/users/login`, {
            username: event.username,
            password: event.password
        })
    
        dispatch({
            type: LOG_IN,
            payload: res
        })
        return { success: true }
    }    
    catch(err) {
        console.log(err)    
        return { success: false }    
    }
}

export const logOut = (event) => async (dispatch) => {
    try {    
        
        let res = await axios.post('/users/logout', { username: event.username })
        dispatch({
            type: LOG_OUT,
            payload: res
        })
    }   
    catch(err) {
        console.log(err)        
    }
}

export const updateUserAuth = (event) => async (dispatch) => {
    dispatch({
        type: UPDATE_USER_AUTH,
        payload: event
    })
}

export const getPortfolios = (event) => async (dispatch) => {
    try {
        let res = await axios.post('/users/portfolios', { username: event.username })

        if(res.data.result.length > 0) {
            dispatch({
                type: GET_PORTFOLIOS,
                payload: res.data.result[0].portfolios
            })
            return res.data.result[0].portfolios
        }
        else {
            dispatch({
                type: GET_PORTFOLIOS,
                payload: []
            })

            return []
        }
    }
    catch(err) {
        console.log(err)        
    }
}

export const updatePortfolios = (event) => (dispatch) => {
    dispatch({
        type: UPDATE_PORTFOLIOS,
        payload: event.portfolios
    })
}