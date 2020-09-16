import React from 'react'
import './ProfitTransaction.scss'

// Components
import Layout from '../layout/Layout'
import ProfitForm from './ProfitForm'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

function ProfitTransaction() {
    return (
        <Layout>
            <Container className="transaction-container">
                <Container className="pad-container">
                    <Row className="title">
                        <h4>Register Profit</h4>
                    </Row>
                    <ProfitForm/>
                </Container>
            </Container>
        </Layout>
    )
}

export default ProfitTransaction