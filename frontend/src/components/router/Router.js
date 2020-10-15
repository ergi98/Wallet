import React from 'react'

// Router
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

// Redux
import { connect } from 'react-redux'
import { updateUserAuth } from '../../redux/actions/userActions'
import PropTypes from 'prop-types'

// Axios
import axios from 'axios'

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

    async validateToken() {
        try {
            let res = await axios.post('/users/session', { username: this.props.username })
            if(res.data.session.jwt === this.props.jwt) {
                this.props.updateUserAuth(true)
            }
            else {
                this.props.updateUserAuth(false)
            }
        }
        catch (err) {
            this.props.updateUserAuth(false)
        }
    }

    componentDidMount() {
        this.validateToken()
    }

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
    jwt: state.user.jwt,
    username: state.user.username,
    isAuthenticated: state.user.isAuthenticated
})

Router.propTypes = {
    jwt: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    updateUserAuth: PropTypes.func.isRequired
}
  
export default connect(mapStateToProps, { updateUserAuth })(Router)