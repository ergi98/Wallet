import React from 'react'
import './TodayRecap.scss'

import axios from 'axios'

// Components
import Card from '../card/Card'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// Redux
// Redux 
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

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
        }

        this.s_comp = 0
        this.e_comp = 0
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
        let today = date
        let yesterday = new Date(date.setDate(date.getDate() - 1)).toLocaleDateString('en-GB')

        // Get the yesterday and today spendings amounts
        let t_res = await axios.post("/transactions/daily-recap", { date: today })
        let y_res = await axios.post("/transactions/daily-recap", { date: yesterday })

        if (t_res.status === 200 && y_res.status === 200) {
            let t_spendings = 0, y_spendings = 0, t_earnings = 0, y_earnings = 0

            // Save the amounts into local variables
            if (t_res.data.result.length > 0) {
                t_spendings = t_res.data.result[0].spendings.$numberDecimal
                t_earnings = t_res.data.result[0].earnings.$numberDecimal
            }
            if (y_res.data.result.length > 0) {
                y_spendings = y_res.data.result[0].spendings.$numberDecimal
                y_earnings = y_res.data.result[0].earnings.$numberDecimal
            }

            // Update the state
            this._isMounted && this.setState({
                today_spendings: t_spendings,
                yesterday_spendings: y_spendings,
                today_earnings: t_earnings,
                yesterday_earnings: y_earnings,
            })

            y_spendings === 0 ? this.s_comp = 0 : this.s_comp = (t_spendings - y_spendings) / y_spendings * 100
            y_earnings === 0 ? this.e_comp = 0 : this.e_comp = (t_earnings - y_earnings) / y_earnings * 100
        }
    }

    render() {
        return (
            <Card title={new Date().toDateString()}>
                <Container className="amount-container">
                    <Row>
                        <Col className="spendings-col">
                            <span>Spendings</span>
                            <span className="s-tot">{this.props.currency} {this.state.today_spendings}</span>
                            <span className="comp">
                                {this.s_comp >= 0 ? '+' : '-'}{this.s_comp}%
                            </span>
                        </Col>
                        <Col className="earnings-col">
                            <span>Earnings</span>
                            <span className="e-tot">{this.props.currency} {this.state.today_earnings}</span>
                            <span className="comp">
                                {this.e_comp >= 0 ? '+' : '-'}{this.e_comp}%
                            </span>
                        </Col>
                    </Row>
                    <Row className="total-row">
                        <span>Available Amount: </span>
                        <span className="tot-sum">{this.props.currency} 202,323</span>
                    </Row>
                </Container>
            </Card>
        )
    }
}

const mapPropsToState = state => ({
    currency: state.user.pref_currency
})

TodayRecap.propTypes = {
    currency: PropTypes.string.isRequired
}

export default connect(mapPropsToState, null)(TodayRecap)