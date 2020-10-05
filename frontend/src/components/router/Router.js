import React, { Suspense } from 'react'

// Router
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom"

// Redux
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// Components
import Loading from '../statistics/income-vs-expense/Loading'
const Login = React.lazy(() => import('../login/Login'))
const Home = React.lazy(() => import('../home/Home'))
const Portfolios = React.lazy(() => import('../portfolios/Portfolios'))
const Statistics = React.lazy(() => import('../statistics/Statistics'))
const SpendingTransaction = React.lazy(() => import('../transaction/SpendingTransaction'))
const ProfitTransaction = React.lazy(() => import('../transaction/ProfitTransaction'))
const ViewMore = React.lazy(() => import('../view-more/ViewMore'))
const MyProfile = React.lazy(() => import('../my-profile/MyProfile'))
const SignUp = React.lazy(() => import('../login/SignUp'))

class Router extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <main>
                    <Switch>
                        <Suspense fallback={<Loading />}>
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
                        </Suspense>
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