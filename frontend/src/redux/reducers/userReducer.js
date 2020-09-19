import { LOG_IN, LOG_OUT, GET_PORTFOLIOS } from '../actions/types'

const initialState = {
    isAuthenticated: false,
    username: '',
    name: '',
    surname: '',
    jwt: '',
    pref_currency: ''
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LOG_IN:
            return {
                ...state,
                isAuthenticated: true,
                username: action.payload.data.info.username,
                name: action.payload.data.info.personal.name,
                surname: action.payload.data.info.personal.surname,
                jwt: action.payload.data.auth_token,
                pref_currency: action.payload.data.info.personal.pref_curr
            }
        case LOG_OUT:
            return {
                ...state,
                isAuthenticated: false,
                username: '',
                name: '',
                surname: '',
                jwt: '',
                pref_currency: ''
            }
        case GET_PORTFOLIOS:
            console.log(action.payload)
            return {
                ...state,
                portfolios: action.payload
            }
        default: 
            return state
    }
}