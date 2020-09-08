import React from 'react'
import './TransactionList.scss'
import axios from 'axios'

// Components
import Card from '../card/Card'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Table from 'react-bootstrap/Table'

class TransactionList extends React.Component {

    constructor() {
        super()

        this._isMounted = false

        this.state = {
            transactions : []
        }
    }

    componentDidMount() {
        // Get todays transactions
        this.getTransactions(new Date().toLocaleDateString('en-GB'))
    }

    async getTransactions(date) {
        let res = await axios.post('/transactions/list', { date })

        if(res.status === 200) {
            let { transactions } = res.data.result[0]
            console.log(transactions)
            this.setState({
                transactions
            })
        }
    }

    render() {
        return (
            <Card title="Latest Transactions">
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
                                                <td className="earning">+{transaction.amount.$numberDecimal} {transaction.currency}</td>
                                                :
                                                <td className="spending">{transaction.amount.$numberDecimal} {transaction.currency}</td>
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

export default TransactionList