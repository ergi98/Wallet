import React from 'react'
import './SpendingTransaction.scss'

// Components
import Layout from '../layout/Layout'
import SpendingForm from './SpendingForm'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

function SpendingTransaction() {
    return (
        <Layout>
            <Container className="transaction-container">
                <Container className="pad-container">
                    <Row className="title">
                        <h4>Register Expense</h4>
                    </Row>
                    <SpendingForm/>
                </Container>
            </Container>
        </Layout>
    )
}

export default SpendingTransaction
