import { LOG_IN, LOG_OUT } from '../actions/types'
import axios from 'axios'


/** TODO: 3 - Handle all user errors here by dispatching new actions */
export const logIn = (event) => async (dispatch) => {
    let res = await axios.post(`/users/login`, {
        username: event.username,
        password: event.password
    })

    dispatch({
        type: LOG_IN,
        payload: res
    })
}

export const logOut = (event) => async (dispatch) => {
    let res = await axios.post('/users/logout', {
        username: event.username
    })

    if(res.status === 200) {
        dispatch({
            type: LOG_OUT,
            payload: res
        })
    }
}