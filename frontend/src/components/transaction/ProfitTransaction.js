import React, { Suspense } from 'react'
import './SpendingTransaction.scss'

// Components
import Layout from '../layout/Layout'
import Loading from '../loaders/Loading'
const ProfitForm = React.lazy(() => import('./ProfitForm'))

// Bootstrap
const Container = React.lazy(() => import('react-bootstrap/esm/Container'))

function ProfitTransaction() {
    return (
        <Layout>
            <Suspense fallback={<Loading/>}>
                <Container className="pad-container">
                    <div className="title">
                        <h4>Register Profit</h4>
                    </div>
                    <ProfitForm/>
                </Container>
            </Suspense>
           
        </Layout>
    )
}

export default ProfitTransaction