// Redux
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers/index'

// Making the store persist
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/es/storage/session'
import { autoMergeLevel2 } from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

// Middleware
import thunk from 'redux-thunk'

const initialState = {}

const middleware = [thunk]

const persistConfig = {
    key: "root",
    storage: storageSession,
    stateReconciler: autoMergeLevel2
}

const pReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
    pReducer,
    initialState,
    compose(
       applyMiddleware(...middleware)
    )    
)

const persistor = persistStore(store)

export { store, persistor }

// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()