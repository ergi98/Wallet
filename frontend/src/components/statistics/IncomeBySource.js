import React, { useState, useEffect } from 'react'
import './IncomeBySource.scss'

// Axios
import axios from 'axios'

// Redux
import { logOut } from '../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'

// Components
const Card = React.lazy(() => import('../card/Card'))
const Loading = React.lazy(() => import('../loaders/Loading'))

// Bootstrap
const Container = React.lazy(() => import('react-bootstrap/esm/Container'))

// Material UI
const Table = React.lazy(() => import('@material-ui/core/Table'))
const TableBody = React.lazy(() => import('@material-ui/core/TableBody'))
const TableCell = React.lazy(() => import('@material-ui/core/TableCell'))
const TableContainer = React.lazy(() => import('@material-ui/core/TableContainer'))
const TableHead = React.lazy(() => import('@material-ui/core/TableHead'))
const TableRow = React.lazy(() => import('@material-ui/core/TableRow'))

// Number Format
const NumberFormat = React.lazy(() => import('react-number-format'))

function IncomeBySource() {

    const dispatch = useDispatch()

    const jwt = useSelector((state) => state.user.jwt)
    const username = useSelector((state) => state.user.username)
    const pref_currency = useSelector((state) => state.user.pref_currency)

    const [incomes, setIncome] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let _isMounted = true

        async function getIncome() {
            try {
                let res = await axios.post('/users/user-sources', { username }, { headers: { Authorization: `Bearer ${jwt}`}})

                if (res.data.result.length > 0) {
                    res.data.result[0].sources.sort((a, b) => {
                        if (parseFloat(a.amount_earned.$numberDecimal) > parseFloat(b.amount_earned.$numberDecimal))
                            return -1
                        if (parseFloat(a.amount_earned.$numberDecimal) < parseFloat(b.amount_earned.$numberDecimal))
                            return 1
                        return 0
                    })
                    setIncome(res.data.result[0].sources)
                }
                setLoading(false)
            }
            catch (err) {
                // If no token is present logout
                if(err.message.includes('403'))
                    dispatch(logOut())
                else
                    setLoading(false)
            }
        }

        _isMounted && getIncome()

        return () => {
            _isMounted = false
        }
    }, [username, jwt, dispatch])

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
