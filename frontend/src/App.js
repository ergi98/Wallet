import React from 'react'
import './App.scss';

// Components
import Login from './components/login/Login'
import Home from './components/home/Home'
import Portfolios from './components/portfolios/Portfolios'
import Statistics from './components/statistics/Statistics'
import Transaction from './components/transaction/Transaction'
import NotFound from './components/not-found/NotFound'
import NavBar from './components/navbar/NavBar'

// Router
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom"

let isAuthenticated;

// Function which determines the status of the user (either authenticated or not)
( 
  function getAuthStatus() {
    let myJWT = localStorage.getItem('jwt')
    let username = localStorage.getItem('username')
    let decodedJWT

    const decoder = require('jwt-decode')
    
    if(myJWT) {
      decodedJWT = decoder(myJWT)
      isAuthenticated = (decodedJWT.username === username)
    }
    else
      isAuthenticated = false
    
    localStorage.setItem("isAuthenticated", isAuthenticated)
  }
)();


function App() {
  return (
    <BrowserRouter>
      <main>
        {isAuthenticated ? <NavBar /> : null}
        <Switch>
          <Route path="/" exact component={Login} />
          {
            isAuthenticated ?
              <>
                <Route path="/home" component={Home} />
                <Route path="/portfolios" component={Portfolios} />
                <Route path="/statistics" component={Statistics} />
                <Route path="/transaction" component={Transaction} />
              </> :
              <Redirect to="/" />
          }
          <Route path="*" component={NotFound} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
