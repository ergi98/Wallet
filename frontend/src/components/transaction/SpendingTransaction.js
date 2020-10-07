import React, { Suspense } from 'react'
import './SpendingTransaction.scss'

// Components
import Layout from '../layout/Layout'
import Loading from '../loaders/Loading'
const SpendingForm = React.lazy(() => import('./SpendingForm'))

// Bootstrap
const Container = React.lazy(() => import('react-bootstrap/esm/Container'))

function SpendingTransaction() {
    return (
        <Layout>
            <Suspense fallback={<Loading/>}>
                <Container className="pad-container">
                    <div className="title">
                        <h4>Register Expense</h4>
                    </div>
                    <SpendingForm/>
                </Container>
            </Suspense>
        </Layout>
    )
}

export default SpendingTransaction
