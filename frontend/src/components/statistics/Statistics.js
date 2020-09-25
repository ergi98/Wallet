import React from 'react'
import './Statistics.scss'

// Components
import Layout from '../layout/Layout'
import ExpenseByCategory from './ExpenseByCategory'
import IncomeBySource from './IncomeBySource'
import IncomeVSExpense from './IncomeVSExpense'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'

function Statistics() {
    return (
        <Layout>
            <Container className="statistics-container">
                <Row><ExpenseByCategory/></Row>
                <Row><IncomeBySource/></Row>
                <Row>
                    <IncomeVSExpense/>
                </Row>
            </Container>
        </Layout>
    )
}

export default Statistics