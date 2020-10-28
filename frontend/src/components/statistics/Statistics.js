import React from 'react'
import './Statistics.scss'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'

// Components
const ExpenseByCategory = React.lazy(() => import('./ExpenseByCategory'))
const IncomeBySource = React.lazy(() => import('./IncomeBySource'))
const IncomeVSExpense = React.lazy(() => import('./income-vs-expense/IncomeVSExpense'))
const IAEMain = React.lazy(() => import('./iae-graphs/IAEMain'))

function Statistics() {
    return (
        <Container fluid className="statistics-container">
                <Row><ExpenseByCategory/></Row>
                <Row><IncomeBySource/></Row>
                <Row><IncomeVSExpense/></Row>
                <Row><IAEMain/></Row>
        </Container>
    )
}

export default Statistics