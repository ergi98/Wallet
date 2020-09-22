import React, { useState, useEffect } from 'react'
import './IncomeBySource'

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

function IncomeBySource() {

    const username = useSelector((state) => state.user.username)
    const pref_currency = useSelector((state) => state.user.pref_currency)

    const [incomes, setIncome] = useState([])

    async function getIncome(username) {
        try {
            let res = await axios.post('/users/user-sources', { username })

            console.log(res.data.result[0].sources )
            if(res.data.result.length > 0) {
                res.data.result[0].sources.sort((a, b) => {
                    if(a.amount_earned.$numberDecimal > b.amount_earned.$numberDecimal) 
                        return 1
                    if(a.amount_earned.$numberDecimal < b.amount_earned.$numberDecimal)
                        return -1
                    return 0
                })
                setIncome(res.data.result[0].sources)
            }
        }
        catch(err) {

        }
    }

    useEffect(() => {
        let _isMounted = true
        _isMounted && getIncome(username)
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
                            incomes.map((income, index) =>
                                <tr key={income.cat_id}>
                                    <td>{index + 1}</td>
                                    <td>{income.source_name}</td>
                                    <td>{income.count}</td>
                                    <td className="earning">
                                        <NumberFormat
                                            value={income.amount_earned.$numberDecimal}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={pref_currency + ' '}
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

export default IncomeBySource
