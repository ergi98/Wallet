import React from 'react'
import './IncomeVSExpense.scss'

// Bootstrap
import Spinner from 'react-bootstrap/esm/Spinner'

function Loading() {
    return (
        <div className="income-vs-expense loading-screen">
            <div className="loading">
                <Spinner as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                <label>Loading ...</label>
            </div>
            
        </div>
    )
}

export default Loading
