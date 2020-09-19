import React, { useState, useEffect } from 'react'
import './ViewMore.scss'

// Axios
import axios from 'axios'

// Components 
import Layout from '../layout/Layout'
import DeleteModal from './DeleteModal'

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
import { AiFillCaretLeft, AiFillCaretRight, AiFillDelete } from 'react-icons/ai'

// Number Format
import NumberFormat from 'react-number-format'

// Date validation
import { parse, compareAsc } from 'date-fns'

function ViewMore({ match })  {

    const username = useSelector((state) => state.user.username)

    const [date, setDate] = useState(new Date())
    const [displayedDate, setDisplayDate] = useState(new Date().toLocaleDateString('en-GB'))
    
    const [transactions, setTransactions] = useState([])

    const [displayError, setError] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [isInvalid, setInvalid] = useState(false)

    const [deleteTransaction, setDeleteTransaction] = useState([])
    const [showDeleteModal, setDelete] = useState(false)
    const [showDeleteError, setDeleteError] = useState(false)
    const [showDeleteSuccess, setDeleteSuccess] = useState(false)

    useEffect(() => {
        let _isMounted = true
        
        _isMounted && setDisabled(true)
        
        async function getTransactions(username, date) {
            try {    
                let res = await axios.post('/transactions/list', { username, date, portfolio: match.params.pid})

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
    }, [username, date, match])

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

    function closeDelete() {
        setDelete(false)
    }

    function deleteStatus(status) {
        if(status === "success") {
            // To invoke a refetch from the database without refreshing
            setDate(parse(displayedDate, 'dd/MM/yyyy', new Date()))
            setDeleteSuccess(true)
            setTimeout(() => { setDeleteSuccess(false)}, 2500);
        }
        else {
            setDeleteError(true)
            setTimeout(() => { setDeleteError(false)}, 2500);
        }
    }

    return (
        <Layout>
            <Container className="view-more_container">
                {/** Transaction List Errors */}
                <Alert show={displayError} variant="danger" className="alert" as="Row">
                    <Alert.Heading className="heading">Display Transactions</Alert.Heading>
                    An error occured while trying to get this user transactions.
                </Alert>
                {/** Delete Transaction Errors */}
                <Alert show={showDeleteError} variant="danger" className="alert" as="Row">
                    <Alert.Heading className="heading">Delete Transaction</Alert.Heading>
                    An error occured while trying to delete this transaction.
                </Alert>
                <Alert show={showDeleteSuccess} variant="success" className="alert" as="Row">
                    <Alert.Heading className="heading">Delete Transaction</Alert.Heading>
                    Successfuly deleted the transaction.
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
                                    <Row key={transaction.trans_id} className="transaction">
                                        <Col className="field-col" xs={11} lg={11}>
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
                                        </Col>
                                        <Col className="btn-col" xs={1} lg={1}>
                                            <Row className="btn-row">
                                                <Button className="btn" variant="link" onClick={() => { setDelete(true); setDeleteTransaction(transaction) }}>
                                                    <IconContext.Provider value={{ size: "25", style: { color: "#D32A17", verticalAlign: 'middle' } }}>
                                                        <AiFillDelete />
                                                    </IconContext.Provider> 
                                                </Button>
                                            </Row>
                                        </Col>
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
            <DeleteModal 
                show={showDeleteModal} 
                transaction={deleteTransaction}
                date={date}
                username={username}
                onClose={closeDelete}
                deleteStatus={deleteStatus}
            />
        </Layout>
    )
}

export default ViewMore
