import React, { Suspense } from 'react'

// Router
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

// Redux
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// Components
import Layout from '../layout/Layout'
import Loading from '../loaders/Loading'
import Login from '../login/Login'
import SignUp from '../login/SignUp'
const Home = React.lazy(() => import('../home/Home'))
const Portfolios = React.lazy(() => import('../portfolios/Portfolios'))
const Statistics = React.lazy(() => import('../statistics/Statistics'))
const SpendingTransaction = React.lazy(() => import('../transaction/SpendingTransaction'))
const ProfitTransaction = React.lazy(() => import('../transaction/ProfitTransaction'))
const ViewMore = React.lazy(() => import('../view-more/ViewMore'))
const MyProfile = React.lazy(() => import('../my-profile/MyProfile'))

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
                                            <Layout>
                                                <Suspense fallback={<Loading/>}><Route path="/home" exact component={Home}/></Suspense>
                                                <Suspense fallback={<Loading/>}><Route path="/portfolios" exact component={Portfolios}/> </Suspense>
                                                <Suspense fallback={<Loading/>}><Route path="/portfolios/transactions/:pid" exact component={ViewMore}/> </Suspense>
                                                <Suspense fallback={<Loading/>}><Route path="/statistics" exact component={Statistics}/> </Suspense>
                                                <Suspense fallback={<Loading/>}><Route path="/my-profile" exact component={MyProfile}/> </Suspense>
                                                <Suspense fallback={<Loading/>}><Route path="/view-more" exact component={ViewMore}/> </Suspense>
                                                <Suspense fallback={<Loading/>}><Route path="/expense-transaction" exact component={SpendingTransaction}/> </Suspense>
                                                <Suspense fallback={<Loading/>}><Route path="/profit-transaction" exact component={ProfitTransaction}/> </Suspense> 
                                            </Layout>
                                        </> 
                                        :
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