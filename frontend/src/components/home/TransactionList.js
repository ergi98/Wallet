import React from 'react'
import './TransactionList.scss'
import axios from 'axios'
import Helpers from '../../helpers/Helpers'

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
        this.getTransactions(new Date())
    }

    async getTransactions(date) {
        let parsed_date = await Helpers.parseDate(date)

        let res = await axios.post('/transactions/list', {
            date: parsed_date
        })

        console.log(res)
    }

    render() {
        return (
            <Card title="Latest Transactions">
                <Container className="list-container">
                    <Table responsive striped className="list-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.transactions.map(transaction => 
                                    <tr key={transaction.trans_id}> 
                                        <td>{transaction.name}</td>
                                        <td>{transaction.amount} {transaction.currency}</td>
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