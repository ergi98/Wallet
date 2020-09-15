import React from 'react'

// Router
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom"

// Components
import Login from '../login/Login'
import Home from '../home/Home'
import Portfolios from '../portfolios/Portfolios'
import Statistics from '../statistics/Statistics'
import SpendingTransaction from '../transaction/SpendingTransaction'
import ProfitTransaction from '../transaction/ProfitTransaction'
import NotFound from '../not-found/NotFound'
import ViewMore from '../view-more/ViewMore'
import MyProfile from '../my-profile/MyProfile'

// Redux
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


class Router extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <main>
                    <Switch>
                        <Route path="/" exact component={Login} />
                        {
                            this.props.isAuthenticated ?
                                <>
                                    <Route path="/home" exact component={Home} />
                                    <Route path="/portfolios" exact component={Portfolios} />
                                    <Route path="/statistics" exact component={Statistics} />
                                    <Route path="/my-profile" exact component={MyProfile} />
                                    <Route path="/view-more" exact component={ViewMore} />
                                    <Route path="/expense-transaction" exact component={SpendingTransaction} />
                                    <Route path="/profit-transaction" exact component={ProfitTransaction} />
                                </> :
                                <Redirect to="/" />
                        }
                        <Route path="*" component={NotFound} />
                    </Switch>
                </main>
            </BrowserRouter>
        )
    }
}

let mapStateToProps = state => ({
    isAuthenticated: state.user.isAuthenticated
})

Router.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
}
  
export default connect(mapStateToProps, null)(Router)