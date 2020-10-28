import React from 'react'
import './SpendingTransaction.scss'

// Components
const ProfitForm = React.lazy(() => import('./ProfitForm'))

// Bootstrap
const Container = React.lazy(() => import('react-bootstrap/esm/Container'))

function ProfitTransaction() {
    return (
        <Container className="pad-container">
            <div className="title">
                <h4>Register Profit</h4>
            </div>
            <ProfitForm/>
        </Container>
    )
}

export default ProfitTransaction