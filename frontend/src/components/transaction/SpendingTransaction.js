import React from 'react'
import './SpendingTransaction.scss'

// Components
import Layout from '../layout/Layout'
import SpendingForm from './SpendingForm'

// Bootstrap
import Container from 'react-bootstrap/Container'

function SpendingTransaction() {
    return (
        <Layout>
            <Container className="pad-container">
                <div className="title">
                    <h4>Register Expense</h4>
                </div>
                <SpendingForm/>
            </Container>
        </Layout>
    )
}

export default SpendingTransaction
