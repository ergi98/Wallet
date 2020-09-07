import { LOG_IN } from '../actions/types'
import axios from 'axios'

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