import React, { useState } from 'react'
import './ExpenseByCategory.scss'

// Axios
// import axios from 'axios'

// Components
import Card from '../card/Card'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Table from 'react-bootstrap/Table'

// Number Format
import NumberFormat from 'react-number-format'

function ExpenseByCategory() {

    const [expenses, setExpenses] = useState([])
    
    return (
        <Card title="Expenses By Category" hasButton={true} buttonTxt="Change Sort">
            <Container className="list-container">
                <Table responsive striped className="list-table">
                    <thead>
                        <tr className="headers-row">
                            <th>#</th>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            expenses.map(expense => 
                                <tr key={expense.cat_id}> 
                                    <td>{expense.time}</td>
                                    <td>{expense.short_desc}</td>
                                    { 
                                        expense.amount.$numberDecimal > 0?
                                            <td className="earning">
                                                <NumberFormat 
                                                    value={expense.amount.$numberDecimal}
                                                    displayType={'text'} 
                                                    thousandSeparator={true} 
                                                    prefix={'+ ' + expense.currency + ' ' } 
                                                />
                                            </td>
                                            :
                                            <td className="spending">
                                                <NumberFormat 
                                                    value={expense.amount.$numberDecimal}
                                                    displayType={'text'} 
                                                    thousandSeparator={true} 
                                                    prefix={' ' + expense.currency + ' ' } 
                                                />
                                            </td>
                                    }
                                </tr>
                            )
                        }
                    </tbody>

                </Table>
            </Container>
        </Card>
    )
}

export default ExpenseByCategory