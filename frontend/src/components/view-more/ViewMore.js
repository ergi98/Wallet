import React, { useState, useEffect } from 'react'
import './ViewMore.scss'

// Axios
import axios from 'axios'

// Components 
import Layout from '../layout/Layout'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

// Redux
import { useSelector } from 'react-redux'

// Icons
import { IconContext } from "react-icons"
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai'

// Number Format
import NumberFormat from 'react-number-format'

function ViewMore()  {

    const username = useSelector((state) => state.user.username)
    const [date, setDate] = useState(new Date().toLocaleDateString('en-GB'))
    const [displayedDate, setDisplayDate] = useState(new Date().toLocaleDateString('en-GB'))
    const [transactions, setTransactions] = useState([])
    const [displayError, setError] = useState(false)

    useEffect(() => {
        let _isMounted = true

        async function getTransactions(date) {
            try {
                let res = await axios.post('/transactions/list', { username, date })

                if(res.status === 200 && res.data.result.length > 0) {
                    let { transactions } = res.data.result[0]
                    
                    console.log(transactions)
                    _isMounted && setTransactions(transactions)
                }
            }
            catch(err) {
                _isMounted && setError(true)

                setTimeout(() => {
                    _isMounted && setError(false)
                }, 2500);
            }
        }

        _isMounted && getTransactions(date)

        return () => {
            _isMounted = false
        }
    }, [date])

    
    function validateDate(event) {
        setDisplayDate(event.target.value)
    }

    return (
        <Layout>
            <Container className="view-more_container">
                <Alert show={displayError} variant="danger" className="alert" as="Row">
                    <Alert.Heading className="heading">Display Transactions</Alert.Heading>
                    An error occured while trying to get this user transactions.
                </Alert>
                <Row className="date-row">
                    <Col className="left-btn">
                        <Button variant="link">
                            <IconContext.Provider value={{ size: "35", style: { verticalAlign: 'middle', marginTop: "-5px" } }}>
                                <AiFillCaretLeft />
                            </IconContext.Provider> 
                        </Button>
                    </Col>
                    <Col className="date-picker">
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Date"
                            aria-label="Date"
                            value={displayedDate}
                            onChange={validateDate}
                        />
                    </InputGroup>
                    </Col>
                    <Col className="right-btn">
                        <Button variant="link">
                            <IconContext.Provider value={{ size: "35", style: { verticalAlign: 'middle', marginTop: "-5px" } }}>
                                <AiFillCaretRight />
                            </IconContext.Provider> 
                        </Button>
                    </Col>
                </Row>
                {
                    transactions.length > 0? 
                        <Container className="more-transactions">
                            {   
                                transactions.map(transaction => 
                                    <Row key={transaction.trans_id}>
                                        <Container className="transaction">
                                            <Row className="desc">
                                                <label className="field-desc">Description:</label>
                                                <label className="field-value">{transaction.short_desc}</label>
                                            </Row>
                                            <Row className="location">
                                                <label className="field-desc">Location:</label>
                                                <Button variant="link" className="map-btn"> View in Map</Button>
                                            </Row>
                                            <Row className="time-type">
                                                <Col className="time">
                                                    <label className="field-desc">Time:</label>
                                                    <label className="field-value">{transaction.time}</label>
                                                </Col>
                                                <Col className="type">
                                                    <label className="field-desc">Type:</label>
                                                    <label className="field-value">{transaction.trans_type}</label>
                                                </Col>
                                            </Row>
                                            {
                                                transaction.trans_type === "expense"?
                                                    <Row className="cat-src">
                                                        <label className="field-desc">Category:</label>
                                                        <label className="field-value">{transaction.type}</label>
                                                    </Row>
                                                    :
                                                    <Row className="cat-src">
                                                        <label className="field-desc">Source:</label>
                                                        <label className="field-value">{transaction.source}</label>
                                                    </Row>
                                            }
                                            {
                                                transaction.desc? 
                                                <Row className="long-desc">
                                                    <label className="field-desc">Detailed Description:</label>
                                                    <label className="field-value">{transaction.desc}</label>
                                                </Row>
                                                :
                                                null
                                            }
                                            <Row className="amount">
                                                <label className="field-desc">Amount:</label>
                                                <label className={`field-value ${transaction.trans_type === "expense"? "expense" : "profit" }`}>
                                                    <NumberFormat 
                                                        value={ transaction.amount.$numberDecimal }
                                                        displayType={'text'} 
                                                        thousandSeparator={true} 
                                                        prefix={ transaction.currency + ' ' } 
                                                    /> 
                                                </label>
                                            </Row>
                                            <Container className={`banner ${transaction.trans_type === "expense"? "red" : "green" }`}></Container>
                                        </Container>
                                    </Row>
                                )
                            }
                        </Container>
                        :
                        <div className="no-transactions">
                            <label className="title-label">There seem to be no transactions for the selected date.</label><br/>
                            <label className="sub-label">Please choose a different date.</label>
                        </div>
                }
            </Container>
        </Layout>
    )
}

export default ViewMore
