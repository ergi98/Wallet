import React from 'react'
import './Statistics.scss'

// Components
import Layout from '../layout/Layout'
import ExpenseByCategory from './ExpenseByCategory'
import IncomeBySource from './IncomeBySource'
import IncomeVSExpense from './income-vs-expense/IncomeVSExpense'
import IAEMain from './iae-graphs/IAEMain'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'


function Statistics() {
    return (
        <Layout>
            <Container fluid className="statistics-container">
                <Row><ExpenseByCategory/></Row>
                <Row><IncomeBySource/></Row>
                <Row><IncomeVSExpense/></Row>
                <Row><IAEMain/></Row>
            </Container>
        </Layout>
    )
}

export default Statistics