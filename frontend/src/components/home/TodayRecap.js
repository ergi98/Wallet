import React from 'react'
import './TodayRecap.scss'

import axios from 'axios'

// Components
import Card from '../card/Card'
import SmallLoading from './SmallLoading'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'

// Redux 
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// Number Format
import NumberFormat from 'react-number-format'

class TodayRecap extends React.Component {

    constructor() {
        super()

        /**
         * Variable used to prevent memory leaks
         * Used to cancel any subscriptions active 
         * when user leaves this page
         */
        this._isMounted = false

        this.state = {
            today_spendings: 0,
            yesterday_spendings: 0,
            today_earnings: 0,
            yesterday_earnings: 0,
            s_comp: 0,
            e_comp: 0,
            isLoading: true
        }

    }

    componentDidMount() {   
        this._isMounted = true
        this._isMounted && this.getSpendings(new Date())
    }

    // Unsubscribe from all active subscriptions
    componentWillUnmount() {
        this._isMounted = false;
    }

    async getSpendings(date) {
        // Parse the dates in the correct database format
        let today = date.toLocaleDateString('en-GB')
        let yesterday = new Date(date.setDate(date.getDate() - 1)).toLocaleDateString('en-GB')

        // Get the yesterday and today spendings amounts
        let t_res = await axios.post("/transactions/daily-recap", { username: this.props.username, date: today })
        let y_res = await axios.post("/transactions/daily-recap", { username: this.props.username, date: yesterday })
        let amnt_res = await axios.post("users/available-amount", { username: this.props.username })

        let t_spendings = 0, y_spendings = 0, t_earnings = 0, y_earnings = 0, amount = 0, s_comp = 0, e_comp = 0

        // Save the amounts into local variables
        if (t_res.data.result.length > 0) {
            t_spendings = t_res.data.result[0].spendings.$numberDecimal
            t_earnings = t_res.data.result[0].earnings.$numberDecimal
        }
        if (y_res.data.result.length > 0) {
            y_spendings = y_res.data.result[0].spendings.$numberDecimal
            y_earnings = y_res.data.result[0].earnings.$numberDecimal
        }
        if(amnt_res.data.result.length > 0)
            amount = amnt_res.data.result[0].amount.$numberDecimal

        y_spendings === "0" ? s_comp = 0 : s_comp = (((-1*t_spendings) - (-1*y_spendings)) / y_spendings * -100).toFixed(0)
        y_earnings === "0" ? e_comp = 0 : e_comp = ((t_earnings - y_earnings) / y_earnings * 100).toFixed(0)

            // Update the state
            this._isMounted && this.setState({
            today_spendings: t_spendings,
            yesterday_spendings: y_spendings,
            today_earnings: t_earnings,
            yesterday_earnings: y_earnings,
            amount: amount,
            e_comp,
            s_comp,
            isLoading: false
        })
    }

    render() {
        return (
            <Card title={new Date().toDateString()}>
                <Container className="amount-container">
                    <Row>
                        <Col className="spendings-col">
                            <span>Spendings</span>
                            <span className="s-tot">
                                {
                                    this.state.isLoading?
                                        <SmallLoading/>
                                        :
                                        <NumberFormat 
                                            value={this.state.today_spendings} 
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            prefix={' ' + this.props.currency + ' ' } 
                                        /> 
                                }
                            </span>
                            <span className="comp">
                                {this.state.s_comp}%
                            </span>
                        </Col>
                        <Col className="earnings-col">
                            <span>Earnings</span>
                            <span className="e-tot">
                                {
                                    this.state.isLoading?
                                        <SmallLoading/>
                                        :
                                        <NumberFormat 
                                            value={this.state.today_earnings}
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            prefix={this.props.currency + ' ' } 
                                        />
                                }
                            </span>
                            <span className="comp">
                                {this.state.e_comp}%
                            </span>
                        </Col>
                    </Row>
                    <Row className="total-row">
                        <span>Available Amount: </span>
                        <span className="tot-sum">
                            {
                                this.state.isLoading?
                                    <SmallLoading/>
                                    :
                                    <NumberFormat 
                                        value={this.state.amount}
                                        displayType={'text'} 
                                        thousandSeparator={true} 
                                        prefix={this.props.currency + ' ' } 
                                    />
                            }
                        </span>
                    </Row>
                </Container>
            </Card>
        )
    }
}

const mapPropsToState = state => ({
    currency: state.user.pref_currency,
    username: state.user.username
})

TodayRecap.propTypes = {
    currency: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
}

export default connect(mapPropsToState, null)(TodayRecap)