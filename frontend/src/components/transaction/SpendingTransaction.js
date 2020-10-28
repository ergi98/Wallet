import React from 'react'
import './SpendingTransaction.scss'

// Components
const SpendingForm = React.lazy(() => import('./SpendingForm'))

// Bootstrap
const Container = React.lazy(() => import('react-bootstrap/esm/Container'))

function SpendingTransaction() {
    return (
        <Container className="pad-container">
            <div className="title">
                <h4>Register Expense</h4>
            </div>
            <SpendingForm/>
        </Container>
    )
}

export default SpendingTransaction
