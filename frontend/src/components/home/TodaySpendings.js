import React from 'react'
import './TodaySpendings.scss'
import axios from 'axios'
import Helpers from '../../helpers/Helpers'

// Components
import Card from '../card/Card'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'

class TodaySpendings extends React.Component {

    constructor() {
        super()

        /**
         * Variable used to prevent memory leaks
         * Used to cancel any subscriptions active 
         * when user leaves this page
         */
        this._isMounted = false

        this.state = {
            today_amount: 0,
            yesterday_amount: 0,
            compare: 0,
            currency: "ALL"
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

    getSpendings(date) {
        let t_amnt = localStorage.getItem('t_amnt')
        let y_amnt = localStorage.getItem('y_amnt')
        let comp = localStorage.getItem('comp')

        // If the values are saved in localstorage use them
        if (t_amnt && y_amnt && comp) {
            // Update State
            this._isMounted && this.setState({
                today_amount: t_amnt,
                yesterday_amount: y_amnt,
                compare: comp,
            })
        }
        // Else get the values from the database
        else {
            this.getFromDB(date)
        }
    }

    async getFromDB(date) {
        // Parse the dates in the correct database format
        let today = await Helpers.parseDate(date)
        let yesterday = await Helpers.parseDate(new Date(date.setDate(date.getDate() - 1)))

        // Get the yesterday and today spendings amounts
        let t_res = await axios.post("/transactions/spendings", { date: today })
        let y_res = await axios.post("/transactions/spendings", { date: yesterday })

        if (t_res.status === 200 && y_res.status === 200) {
            let t_amnt = 0, y_amnt = 0

            // Save the amounts into local variables
            if (t_res.data.result.length > 0)
                t_amnt = t_res.data.result[0].spendings.$numberDecimal

            if (y_res.data.result.length > 0)
                y_amnt = y_res.data.result[0].spendings.$numberDecimal

            // Calculate the increase or decrease percentage
            let comp = y_amnt === 0 ? 0 : (t_amnt - y_amnt) / y_amnt * 100

            // Update the state
            this._isMounted && this.setState({
                today_amount: t_amnt,
                yesterday_amount: y_amnt,
                compare: comp
            })

            /**
             * Store a copy in localstorage
             * This is used so the user wont have
             * to do frequent queries in the db
             */
            localStorage.setItem('t_amnt', t_amnt)
            localStorage.setItem('y_amnt', y_amnt)
            localStorage.setItem('comp', comp)
        }
    }

    render() {
        return (
            <Card title="Todays Spending">
                <Container className="amount-container">
                    <section className="amount">{this.state.currency} {this.state.today_amount}</section>
                    {
                        this.state.compare > 0 ?
                            <section className="cmp overspend">+{this.state.compare}%</section>
                            :
                            <section className="cmp underspend">{this.state.compare}%</section>
                    }
                </Container>
            </Card>
        )
    }
}

export default TodaySpendings