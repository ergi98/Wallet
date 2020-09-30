import React, { useState, useEffect } from 'react'
import './IncomeBySource.scss'

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

function IncomeBySource() {

    const username = useSelector((state) => state.user.username)
    const pref_currency = useSelector((state) => state.user.pref_currency)

    const [incomes, setIncome] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let _isMounted = true

        async function getIncome() {
            try {
                let res = await axios.post('/users/user-sources', { username })

                if (res.data.result.length > 0) {
                    res.data.result[0].sources.sort((a, b) => {
                        if (a.amount_earned.$numberDecimal > b.amount_earned.$numberDecimal)
                            return -1
                        if (a.amount_earned.$numberDecimal < b.amount_earned.$numberDecimal)
                            return 1
                        return 0
                    })
                    setIncome(res.data.result[0].sources)
                }
                setLoading(false)
            }
            catch (err) {
                setLoading(false)
                console.log(err)
            }
        }

        _isMounted && getIncome()

        return () => {
            _isMounted = false
        }
    }, [username])

    return (
        <Card title="Income By Source" className="income-card">
            <Container className="scrollable-container">
                {
                    incomes.length >= 1 && !loading ?
                        <TableContainer className="scrollable-table">
                            <Table stickyHeader aria-label="sticky table">
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
                                        incomes.map((income, index) => {
                                            return (
                                                <TableRow key={income.source_id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{income.source_name}</TableCell>
                                                    <TableCell>{income.count}</TableCell>
                                                    <TableCell className="earning">
                                                        <NumberFormat
                                                            value={income.amount_earned?.$numberDecimal}
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
                    incomes.length < 1 && !loading?
                        <div className="no-transactions">
                            <label className="title-label">You have no income sources!</label><br/>
                            <label className="sub-label">
                                You can insert a new income source by going to your profile and scrolling down to the income sources table.
                                Without any sources you can not view this table!
                            </label>
                        </div> : null
                }
                { loading? <Loading/> : null }
            </Container>
        </Card>
    )
}

export default IncomeBySource
