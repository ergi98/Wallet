import React from 'react'
import './TransactionList.scss'

// Components
import Card from '../card/Card'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Table from 'react-bootstrap/Table'

class TransactionList extends React.Component {

    constructor() {
        super()

        this.state = {
            transactions : [
                {
                    trans_id: "12313",
                    name: "Trans 1",
                    amount: 1234,
                    currency: "ALL"
                },
                {
                    trans_id: "12314",
                    name: "Trans 2",
                    amount: 1234,
                    currency: "ALL"
                },
                {
                    trans_id: "12315",
                    name: "Trans 3",
                    amount: 1234,
                    currency: "ALL"
                },
                {
                    trans_id: "12316",
                    name: "Trans 1",
                    amount: 1234,
                    currency: "ALL"
                },
                {
                    trans_id: "12317",
                    name: "Trans 2",
                    amount: 1234,
                    currency: "ALL"
                },
                {
                    trans_id: "12318",
                    name: "Trans 3",
                    amount: 1234,
                    currency: "ALL"
                }
            ]
        }
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