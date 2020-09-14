import React from 'react'
import './TransactionList.scss'

// Axios
import axios from 'axios'

// Components
import Card from '../card/Card'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Table from 'react-bootstrap/Table'

// Redux 
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// Number Format
import NumberFormat from 'react-number-format'

class TransactionList extends React.Component {

    constructor() {
        super()

        this._isMounted = false

        this.state = {
            transactions : []
        }
    }

    componentDidMount() {
        this._isMounted = true
        // Get todays transactions
        this._isMounted && this.getTransactions(new Date().toLocaleDateString('en-GB'))
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async getTransactions(date) {
        let res = await axios.post('/transactions/list', { username: this.props.username, date })

        if(res.status === 200 && res.data.result.length > 0) {
            let { transactions } = res.data.result[0]

            this._isMounted && this.setState({
                transactions
            })
        }
    }

    async goToViewMore() {
        window.location = '/view-more'
    }

    render() {
        return (
            <Card title="Latest Transactions" hasButton={true} buttonTxt="View More ..." btnAction={this.goToViewMore}>
                <Container className="list-container">
                    <Table responsive striped className="list-table">
                        <thead>
                            <tr className="headers-row">
                                <th>Time</th>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.transactions.map(transaction => 
                                    <tr key={transaction.trans_id}> 
                                        <td>{transaction.time}</td>
                                        <td>{transaction.short_desc}</td>
                                        { 
                                            transaction.amount.$numberDecimal > 0?
                                                <td className="earning">
                                                    <NumberFormat 
                                                        value={transaction.amount.$numberDecimal}
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        prefix={'+ ' + transaction.currency + ' ' } 
                                                    />
                                                </td>
                                                :
                                                <td className="spending">
                                                    <NumberFormat 
                                                        value={transaction.amount.$numberDecimal}
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        prefix={' ' + transaction.currency + ' ' } 
                                                    />
                                                </td>
                                        }
                                    </tr>
                                )
                            }
                        </tbody>

                    </Table>
                </Container>
            </Card>
        )
    }
}


const mapPropsToState = state => ({
    username: state.user.username
})

TransactionList.propTypes = {
    username: PropTypes.string.isRequired
}

export default connect(mapPropsToState, null)(TransactionList)