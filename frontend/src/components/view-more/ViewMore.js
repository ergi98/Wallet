import React, { useState, useEffect, Suspense } from 'react'
import './ViewMore.scss'

// Axios
import axios from 'axios'

// Components 
import Layout from '../layout/Layout'
import DeleteModal from './DeleteModal'
import Loading from '../loaders/Loading'

// Bootstrap
import Container from 'react-bootstrap/esm/Container'
import Alert from 'react-bootstrap/esm/Alert'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Button from 'react-bootstrap/esm/Button'
import InputGroup from 'react-bootstrap/esm/InputGroup'
import FormControl from 'react-bootstrap/esm/FormControl'

// Redux
import { logOut } from '../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'

// Icons
import { IconContext } from "react-icons"
import { AiFillCaretLeft, AiFillCaretRight, AiFillDelete } from 'react-icons/ai'

// Number Format
import NumberFormat from 'react-number-format'

// Date validation
import { parse, compareAsc } from 'date-fns'

function ViewMore({ match })  {

    const dispatch = useDispatch()

    const jwt = useSelector((state) => state.user.jwt)
    const username = useSelector((state) => state.user.username)

    const [date, setDate] = useState(new Date())
    const [displayedDate, setDisplayDate] = useState(new Date().toLocaleDateString('en-GB'))
    
    const [transactions, setTransactions] = useState([])

    const [displayError, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isInvalid, setInvalid] = useState(false)

    const [deleteTransaction, setDeleteTransaction] = useState([])
    const [showDeleteModal, setDelete] = useState(false)
    const [showDeleteError, setDeleteError] = useState(false)

    useEffect(() => {
        let _isMounted = true
        
        _isMounted && setIsLoading(true)
        
        async function getTransactions(username, date) {
            try {    
                let res = await axios.post('/transactions/list', { username, date, portfolio: match.params.pid}, { headers: { Authorization: `Bearer ${jwt}`}})

                if(res.status === 200 && res.data.result.length > 0) {
                    let { transactions } = res.data.result[0]

                    _isMounted && setTransactions(transactions)
                }
                else {
                    _isMounted && setTransactions([])
                }
            }
            catch(err) {
                // If no token is present logout
                if(err.message.includes('403'))
                    dispatch(logOut())
                else {
                    _isMounted && setError(true)

                    setTimeout(() => {
                        _isMounted && setError(false)
                    }, 2500);
                }
            }
            finally {
                _isMounted && setIsLoading(false)
            }
        }

        _isMounted && getTransactions(username, date.toLocaleDateString('en-GB'))

        return () => {
            _isMounted = false
        }
    }, [username, date, match, jwt, dispatch])

    function validateDate(event) {
        let regex = new RegExp(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)
        
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

    function updateTransactions() {
          // If the date entered by the user is not invalid
          if(!isInvalid) {
            let parsedDate = parse(displayedDate, 'dd/MM/yyyy', new Date())
            // If user entered date is not the same as the current date
            if(parsedDate.toLocaleDateString('en-GB') !== date.toLocaleDateString('en-GB'))
                setDate(parsedDate)
        }
    }

    function deleteStatus(status, transaction) {
        if(status === "success") {
            let newTransactions = transactions
            newTransactions = newTransactions.filter(trans => { return trans.trans_id !== transaction.trans_id  })
            setTransactions(newTransactions)
        }
        else {
            setDeleteError(true)
            setTimeout(() => { setDeleteError(false)}, 2500);
        }
    }

    return (
        <Layout>
            <Container fluid className="view-more_container">
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
                <Row className="date-row">
                    <Col className="left-btn" xs={3}>
                        <Button variant="link" onClick={() => changeDate("decrement")} disabled={isLoading}>
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
                                inputMode="search"
                                value={displayedDate}
                                onChange={validateDate}
                                onBlur={updateTransactions}
                                isInvalid={isInvalid}
                                readOnly={isLoading}
                            />
                        </InputGroup>
                    </Col>
                    <Col className="right-btn" xs={3}>
                        <Button variant="link" onClick={() => changeDate("increment")} disabled={isLoading || date.toLocaleDateString('en-GB') === new Date().toLocaleDateString('en-GB')}>
                            <IconContext.Provider value={{ size: "35", style: { verticalAlign: 'middle', marginTop: "-5px" } }}>
                                <AiFillCaretRight />
                            </IconContext.Provider> 
                        </Button>
                    </Col>
                </Row>
                {
                    transactions.length > 0 && !isLoading? 
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
                        ) : null
                }
                {
                    transactions.length === 0 && !isLoading?
                    <div className="no-transactions">
                            <label className="title-label">There seem to be no transactions for the selected date.</label><br/>
                            <label className="sub-label">Please choose a different date.</label>
                    </div> : null 
                }
                { isLoading? <Loading/> : null}
            </Container>
            <Suspense fallback={<Loading/>}>
                <DeleteModal 
                    show={showDeleteModal} 
                    transaction={deleteTransaction}
                    date={date}
                    username={username}
                    onClose={closeDelete}
                    deleteStatus={deleteStatus}
                />
            </Suspense>
         
        </Layout>
    )
}

export default ViewMore
