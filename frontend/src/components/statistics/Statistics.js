import React, { Suspense } from 'react'
import './Statistics.scss'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'

// Components
import Layout from '../layout/Layout'
import Loading from '../statistics/income-vs-expense/Loading'

const ExpenseByCategory = React.lazy(() => import('./ExpenseByCategory'))
const IncomeBySource = React.lazy(() => import('./IncomeBySource'))
const IncomeVSExpense = React.lazy(() => import('./income-vs-expense/IncomeVSExpense'))
const IAEMain = React.lazy(() => import('./iae-graphs/IAEMain'))

function Statistics() {
    return (
        <Layout>
            <Container fluid className="statistics-container">
                <Row>
                    <Suspense fallback={<Loading/>}><ExpenseByCategory/></Suspense>
                </Row>
                <Row>
                    <Suspense fallback={<Loading/>}><IncomeBySource/></Suspense>
                </Row>
                <Row>
                    <Suspense fallback={<Loading/>}><IncomeVSExpense/></Suspense>
                </Row>
                <Row>
                    <Suspense fallback={<Loading/>}><IAEMain/></Suspense>
                </Row>
            </Container>
        </Layout>
    )
}

export default Statistics