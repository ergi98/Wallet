import React from 'react'

// Router
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom"

// Redux
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// Components
import Login from '../login/Login'
import Home from '../home/Home'
import Portfolios from '../portfolios/Portfolios'
import Statistics from '../statistics/Statistics'
import SpendingTransaction from '../transaction/SpendingTransaction'
import ProfitTransaction from '../transaction/ProfitTransaction'
import ViewMore from '../view-more/ViewMore'
import MyProfile from '../my-profile/MyProfile'
import SignUp from '../login/SignUp'

class Router extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <main>
                        <Switch>
                            <Route path="/" exact component={Login} />
                            <Route path="/sign-up" exact component={SignUp} />
                            {
                                this.props.isAuthenticated ?
                                    <>
                                        <Route path="/home" exact component={Home} />
                                        <Route path="/portfolios" exact component={Portfolios} />
                                        <Route path="/portfolios/transactions/:pid" exact component={ViewMore} />
                                        <Route path="/statistics" exact component={Statistics} />
                                        <Route path="/my-profile" exact component={MyProfile} />
                                        <Route path="/view-more" exact component={ViewMore} />
                                        <Route path="/expense-transaction" exact component={SpendingTransaction} />
                                        <Route path="/profit-transaction" exact component={ProfitTransaction} />
                                    </> :
                                    <Redirect to="/" />
                            }
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