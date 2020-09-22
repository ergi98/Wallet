import React, { useState, useEffect } from 'react'

// Axios
import axios from 'axios'

// Components
import Card from '../card/Card'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Button from 'react-bootstrap/Button'

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

    const [isLoading, setIsLoading] = useState(true)

    const [incomes, setIncome] = useState([])

    useEffect(() => {
        let _isMounted = true

        async function getIncome() {
            try {
                let res = await axios.post('/users/user-sources', { username })
    
                if (res.data.result.length > 0) {
                    console.log(res.data.result[0])
                    res.data.result[0].sources.sort((a, b) => {
                        if (a.amount_earned.$numberDecimal > b.amount_earned.$numberDecimal)
                            return 1
                        if (a.amount_earned.$numberDecimal < b.amount_earned.$numberDecimal)
                            return -1
                        return 0
                    })
                    setIncome(res.data.result[0].sources)
                }
                setIsLoading(false)
            }
            catch (err) {
                setIsLoading(false)
            }
        }

        _isMounted && getIncome()

        return () => {
            _isMounted = false
        }
    }, [username])

    function sortBy(field) {
        // TODO
    }

    return (
        <Card title="Income By Source" >
            <Container className="list-container">
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Cateogry</TableCell>
                                <TableCell>Trans.</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                incomes.map((income) =>{
                                    return (
                                        <TableRow key={income.source_id}>
                                            <TableCell>1</TableCell>
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
                </TableContainer>
            </Container>
        </Card>
    )
}

export default IncomeBySource
