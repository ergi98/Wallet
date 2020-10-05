import React from 'react'
import './SpendingTransaction.scss'

// Components
import Layout from '../layout/Layout'
import ProfitForm from './ProfitForm'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'

function ProfitTransaction() {
    return (
        <Layout>
            <Container className="pad-container">
                <div className="title">
                    <h4>Register Profit</h4>
                </div>
                <ProfitForm/>
            </Container>
        </Layout>
    )
}

export default ProfitTransaction