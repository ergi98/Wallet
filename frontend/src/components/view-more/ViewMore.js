import React, { useState, useEffect } from 'react'
import './ViewMore.scss'

// Axios
import axios from 'axios'

// Components 
import Layout from '../layout/Layout'
import EditModal from './EditModal'

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
import { AiFillCaretLeft, AiFillCaretRight, AiFillDelete, AiFillEdit } from 'react-icons/ai'

// Number Format
import NumberFormat from 'react-number-format'

// Date validation
import { parse, compareAsc } from 'date-fns'

function ViewMore()  {

    const username = useSelector((state) => state.user.username)

    const [date, setDate] = useState(new Date())
    const [displayedDate, setDisplayDate] = useState(new Date().toLocaleDateString('en-GB'))
    
    const [transactions, setTransactions] = useState([])

    const [displayError, setError] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [isInvalid, setInvalid] = useState(false)

    const [showEdit, setEdit] = useState(false)
    // const [showDelete, setDelete] = useState(false)

    useEffect(() => {
        let _isMounted = true
        
        _isMounted && setDisabled(true)

        async function getTransactions(username, date) {
            try {
                let res = await axios.post('/transactions/list', { username, date })

                if(res.status === 200 && res.data.result.length > 0) {
                    let { transactions } = res.data.result[0]

                    _isMounted && setTransactions(transactions)
                }
                else {
                    _isMounted && setTransactions([])
                }
            }
            catch(err) {
                _isMounted && setError(true)

                setTimeout(() => {
                    _isMounted && setError(false)
                }, 2500);
            }
            finally {
                _isMounted && setDisabled(false)
            }
        }

        _isMounted && getTransactions(username, date.toLocaleDateString('en-GB'))

        return () => {
            _isMounted = false
        }
    }, [username, date])

    function validateDate(event) {
        let regex = new RegExp("[0-9]{2}[/]{1}[0-9]{2}[/]{1}[0-9]{4}")
        
        setDisplayDate(event.target.value)
        
        // Test if the format is right
        let match = regex.test(event.target.value)

        if(match) {
            // Check if the date is right
            let parsedDate = parse(event.target.value, 'dd/MM/yyyy', new Date()) 

            // Check if the date is not greater than today's date
            let res = compareAsc(new Date(), parsedDate)

            if(parsedDate.toJSON !== null && res !== -1) {
                setInvalid(false)
                if(parsedDate.toLocaleDateString('en-GB') !== date.toLocaleDateString('en-GB'))
                    setDate(parsedDate)
            }
            else
                setInvalid(true)
        }
        else
            setInvalid(true)
    }

    function changeDate(type) {
        let newDate

        type === "decrement"? 
            newDate = new Date(date.setDate(date.getDate() - 1))
            :            
            newDate = new Date(date.setDate(date.getDate() + 1))

        setDisplayDate(newDate.toLocaleDateString('en-GB'))
        setDate(newDate)
    }

    return (
        <Layout>
            <Container className="view-more_container">
                <Alert show={displayError} variant="danger" className="alert" as="Row">
                    <Alert.Heading className="heading">Display Transactions</Alert.Heading>
                    An error occured while trying to get this user transactions.
                </Alert>
                <Row className="date-row">
                    <Col className="left-btn" xs={3}>
                        <Button variant="link" onClick={() => changeDate("decrement")} disabled={disabled}>
                            <IconContext.Provider value={{ size: "35", style: { verticalAlign: 'middle', marginTop: "-5px" } }}>
                                <AiFillCaretLeft />
                            </IconContext.Provider> 
                        </Button>
                    </Col>
                    <Col className="date-picker" xs={6}>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Date"
                                aria-label="Date"
                                value={displayedDate}
                                onChange={validateDate}
                                isInvalid={isInvalid}
                            />
                        </InputGroup>
                    </Col>
                    <Col className="right-btn" xs={3}>
                        <Button variant="link" onClick={() => changeDate("increment")} disabled={disabled || date.toLocaleDateString('en-GB') === new Date().toLocaleDateString('en-GB')}>
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
                                            <Button className="edit-btn" variant="link" onClick={() => setEdit(true)}>
                                                <IconContext.Provider value={{ size: "25", style: { color: "gray", verticalAlign: 'middle' } }}>
                                                    <AiFillEdit />
                                                </IconContext.Provider> 
                                            </Button>
                                            <Button className="delete-btn" variant="link">
                                                <IconContext.Provider value={{ size: "25", style: { color: "#D32A17", verticalAlign: 'middle' } }}>
                                                    <AiFillDelete />
                                                </IconContext.Provider> 
                                            </Button>
                                            
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
            <EditModal show={showEdit} />
        </Layout>
    )
}

export default ViewMore
