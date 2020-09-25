import React from 'react'
import './IncomeVSExpense.scss'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Spinner from 'react-bootstrap/esm/Spinner'
import Row from 'react-bootstrap/esm/Row'

function Loading() {
    return (
        <Container className="income-vs-expense loading-screen">
            <Row>
                <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                <label>Loading Chart ...</label>
            </Row>
        </Container>
    )
}

export default Loading
