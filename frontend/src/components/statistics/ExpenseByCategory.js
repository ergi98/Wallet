import React, { useState, useEffect } from 'react'
import './ExpenseByCategory.scss'

// Axios
import axios from 'axios'

// Components
import Card from '../card/Card'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

// Redux
import { useSelector } from 'react-redux'

// Number Format
import NumberFormat from 'react-number-format'

function ExpenseByCategory() {

    const username = useSelector((state) => state.user.username)
    const pref_currency = useSelector((state) => state.user.pref_currency)

    const [expenses, setExpenses] = useState([])

    async function getExpenses(username) {
        try {
            let res = await axios.post('/users/user-categories', { username })

            console.log(res.data.result[0].categories )
            if(res.data.result.length > 0) {
                res.data.result[0].categories.sort((a, b) => {
                    if(a.amnt_spent.$numberDecimal > b.amnt_spent.$numberDecimal) 
                        return 1
                    if(a.amnt_spent.$numberDecimal < b.amnt_spent.$numberDecimal)
                        return -1
                    return 0
                })
                setExpenses(res.data.result[0].categories)
            }
        }
        catch(err) {

        }
    }

    useEffect(() => {
        let _isMounted = true
        _isMounted && getExpenses(username)
        return () => {
            _isMounted = false
        }
    }, [username])

    function sortBy(field) {
        // TODO
    }


    return (
        <Card title="Expenses By Category" >
            <Container className="list-container">
                <Table responsive striped className="list-table header-fixed">
                    <thead>
                        <tr className="headers-row">
                            <th style={{ verticalAlign: "middle" }}>#</th>
                            <th>
                                <Button variant="link" className="sort-btn" onClick={() => sortBy("category")}>
                                    Category
                                </Button>
                            </th>
                            <th>
                                <Button variant="link" className="sort-btn" onClick={() => sortBy("transactions")}>
                                    Trans.
                                </Button>
                            </th>
                            <th>
                                <Button variant="link" className="sort-btn" onClick={() => sortBy("amount")}>
                                    Amount
                                </Button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            expenses.map((expense, index) => 
                                <tr key={expense.cat_id}> 
                                    <td>{ index+1 }</td>
                                    <td>{expense.cat_name}</td>
                                    <td>{expense.count}</td>
                                    <td className="spending">
                                        <NumberFormat 
                                            value={expense.amnt_spent.$numberDecimal}
                                            displayType={'text'} 
                                            thousandSeparator={true} 
                                            prefix={ pref_currency + ' ' } 
                                        />
                                    </td>
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