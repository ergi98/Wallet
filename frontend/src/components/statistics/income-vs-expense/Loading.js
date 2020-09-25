import React from 'react'
import './IncomeVSExpense.scss'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Spinner from 'react-bootstrap/esm/Spinner'
import Row from 'react-bootstrap/esm/Row'

function Loading() {
    return (
        <Container className="income-vs-expense loading-screen">
            <div className="loading">
                <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                <label>Loading Chart ...</label>
            </div>
            
        </Container>
    )
}

export default Loading
