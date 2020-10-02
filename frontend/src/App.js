import React from 'react'
import './App.scss'

// Component
import Router from './components/router/Router'

// Redux
import { Provider } from 'react-redux'

// Persistor
import { PersistGate } from 'redux-persist/lib/integration/react'
import { persistor, store } from './redux/store/store'

function App() {
  return (
    <Provider store= { store } >
      <PersistGate persistor={ persistor }>
        <Router/>
      </PersistGate>
    </Provider>
  );
}

export default App
