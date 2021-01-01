import React, { useState, useEffect } from 'react'
import './TodayRecap.scss'

import axios from 'axios'

// Redux 
import { useDispatch, useSelector } from "react-redux"
import { logOut } from '../../redux/actions/userActions'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'

// Number Format
import NumberFormat from 'react-number-format'

// Components
import Card from '../card/Card'
import SmallLoading from '../loaders/SmallLoading'

function TodayRecap() {

    const dispatch = useDispatch()

    const currency = useSelector((state) => state.user.pref_currency)
    const username = useSelector((state) => state.user.username)
    const jwt = useSelector((state) => state.user.jwt)

    const [tSpendings, setTSpendings] = useState("0")
    const [tEarnings, setTEarnings] = useState("0")

    const [ySpendings, setYSpendings] = useState("0")
    const [yEarnings, setYEarnings] = useState("0")

    const [amount, setAmount] = useState("0")

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let _isMounted = true
        
        async function getSpendings(date) {
            // Parse the dates in the correct database format
            let today = transformDate(date.toLocaleDateString('en-GB'))
            let yesterday = transformDate(new Date(date.setDate(date.getDate() - 1)).toLocaleDateString('en-GB'))

            
            try {
                // Get the yesterday and today spendings amounts
                let tRes = await axios.post("/transactions/daily-recap", { username, date: today }, { headers: { Authorization: `Bearer ${jwt}`}})
                let yRes = await axios.post("/transactions/daily-recap", { username, date: yesterday }, { headers: { Authorization: `Bearer ${jwt}`}})
                let amntRes = await axios.post("users/available-amount", { username }, { headers: { Authorization: `Bearer ${jwt}`}})
                
                // Save the amounts into local var
                if (tRes.data.result.length > 0) {
                    setTEarnings(tRes.data.result[0].earnings.$numberDecimal)
                    setTSpendings(tRes.data.result[0].spendings.$numberDecimal)   
                }
                if (yRes.data.result.length > 0) {
                    setYEarnings(yRes.data.result[0].earnings.$numberDecimal)
                    setYSpendings(yRes.data.result[0].spendings.$numberDecimal)
                }
                if(amntRes.data.result.length > 0)
                    setAmount(amntRes.data.result[0].amount.$numberDecimal)

                // Update the state
                setIsLoading(false)
            }
            catch(err) {
                setIsLoading(false)
                // If no token is present logout
                if(err.message.includes('403')) {
                    dispatch(logOut())
                }
            }
        }

        _isMounted && getSpendings(new Date())

        
        return () => { _isMounted = false }
    }, [dispatch, jwt, username])

    // Sets date in YYYY/MM/DD format for accurate querying
    function transformDate(date) {
        const pieces = date.split('/')
        return `${pieces[2]}/${pieces[1]}/${pieces[0]}`
    }

    return (
        <Card title={new Date().toDateString()}>
            <Container className="amount-container">
                <Row>
                    <Col className="spendings-col">
                        <span>Spendings</span>
                        <span className="s-tot">
                            {
                                isLoading?
                                    <SmallLoading/>
                                    :
                                    <NumberFormat 
                                        value={tSpendings} 
                                        displayType={'text'} 
                                        thousandSeparator={true} 
                                        prefix={' ' + currency + ' ' } 
                                    /> 
                            }
                        </span>
                        <span className="comp">
                            {
                                ySpendings === "0" ? 0 : (((-1*parseFloat(tSpendings)) - (-1*parseFloat(ySpendings))) / parseFloat(ySpendings) * -100).toFixed(0)
                            }%
                        </span>
                    </Col>
                    <Col className="earnings-col">
                        <span>Earnings</span>
                        <span className="e-tot">
                            {
                                isLoading?
                                    <SmallLoading/>
                                    :
                                    <NumberFormat 
                                        value={tEarnings}
                                        displayType={'text'} 
                                        thousandSeparator={true} 
                                        prefix={currency + ' ' } 
                                    />
                            }
                        </span>
                        <span className="comp">
                            {
                                yEarnings === "0" ? 0 : ((parseFloat(tEarnings) - parseFloat(yEarnings)) / parseFloat(yEarnings) * 100).toFixed(0)
                            }%
                        </span>
                    </Col>
                </Row>
                <Row className="total-row">
                    <span>Available Amount: </span>
                    <span className="tot-sum">
                        {
                            isLoading?
                                <SmallLoading/>
                                :
                                <NumberFormat 
                                    value={amount}
                                    displayType={'text'} 
                                    thousandSeparator={true} 
                                    prefix={currency + ' ' } 
                                />
                        }
                    </span>
                </Row>
            </Container>
        </Card>
    )
}

export default TodayRecap