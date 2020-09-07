import { LOG_IN } from '../actions/types'

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
        default: 
            return state
    }
}