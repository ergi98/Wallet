import React, { useState, useEffect } from 'react'

// Axios
import axios from 'axios'

// Components
import Card from '../card/Card'
import Loading from './income-vs-expense/Loading'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'

// Material UI
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

// Redux
import { useSelector } from 'react-redux'

// Number Format
import NumberFormat from 'react-number-format'

function ExpenseByCategory() {

    const username = useSelector((state) => state.user.username)
    const pref_currency = useSelector((state) => state.user.pref_currency)

    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)

    async function getExpenses(username) {
        try {
            let res = await axios.post('/users/user-categories', { username })

            if (res.data.result.length > 0) {
                res.data.result[0].categories.sort((a, b) => {
                    if (a.amnt_spent.$numberDecimal > b.amnt_spent.$numberDecimal)
                        return 1
                    if (a.amnt_spent.$numberDecimal < b.amnt_spent.$numberDecimal)
                        return -1
                    return 0
                })
                setExpenses(res.data.result[0].categories)
            }
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
            console.log(err)
        }
    }

    useEffect(() => {
        let _isMounted = true
        _isMounted && getExpenses(username)
        return () => {
            _isMounted = false
        }
    }, [username])

    return (

        <Card title="Expenses By Category" className="income-card">
            <Container className="scrollable-container">
                {
                    expenses.length >= 1 && !loading ?
                        <TableContainer className="scrollable-table">
                            <Table stickyHeader aria-label="sticky table" >
                                <TableHead className="table-header">
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Cateogry</TableCell>
                                        <TableCell>Trans.</TableCell>
                                        <TableCell>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        expenses.map((expense, index) => {
                                            return (
                                                <TableRow key={expense.cat_id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{expense.cat_name}</TableCell>
                                                    <TableCell>{expense.count}</TableCell>
                                                    <TableCell className="spending">
                                                        <NumberFormat
                                                            value={expense.amnt_spent.$numberDecimal}
                                                            displayType={'text'}
                                                            thousandSeparator={true}
                                                            prefix={pref_currency + ' '}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer> : null
                }
                {
                    expenses.length < 1 && !loading?
                        <div className="no-transactions">
                            <label className="title-label">You have no expense categories!</label><br/>
                            <label className="sub-label">
                                You can insert a new expense category by going to your profile and scrolling down to the expense categories table.
                                Without any categories you can not view this table!
                            </label>
                        </div> : null
                }
                { loading? <Loading/> : null }
            </Container>
        </Card>
    )
}

export default ExpenseByCategory