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
                    name: "Trans 1",
                    amount: 1234,
                    currency: "ALL"
                },
                {
                    name: "Trans 2",
                    amount: 1234,
                    currency: "ALL"
                },
                {
                    name: "Trans 3",
                    amount: 1234,
                    currency: "ALL"
                },
                {
                    name: "Trans 1",
                    amount: 1234,
                    currency: "ALL"
                },
                {
                    name: "Trans 2",
                    amount: 1234,
                    currency: "ALL"
                },
                {
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
                                    <tr>
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