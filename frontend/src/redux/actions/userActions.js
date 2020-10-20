// Actions
import { 
    LOG_IN, 
    LOG_OUT,
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
        return { success: false }    
    }
}

export const logOut = () => (dispatch) => {  
    dispatch({
        type: LOG_OUT
    })
}

export const getPortfolios = (event) => async (dispatch) => {
    try {
        let res = await axios.post(
            '/users/portfolios', 
            { username: event.username },
            { headers: { Authorization: `Bearer ${event.jwt}`}}
        )

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
        // If no token is present logout
        if(err.message.includes('403')) {
            dispatch({
                type: LOG_OUT
            })
        }
        return { success: false, err }   
    }
}

export const updatePortfolios = (event) => (dispatch) => {
    dispatch({
        type: UPDATE_PORTFOLIOS,
        payload: event.portfolios
    })
}