import React, { useState, useEffect } from 'react'
import './TransferModal.scss'

// Axios
import axios from 'axios'

// Redux
import { useSelector } from 'react-redux'

// Bootstrap
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

// Number Format
import NumberFormat from 'react-number-format'

function TransferModal(props) {

    const portfolios = useSelector((state) => state.user.portfolios)

    const [from, setFrom] = useState('default')
    const [to, setTo] = useState('default')
    const [amount, setAmount] = useState('')

    const [availAmnt, setAvailAmnt] = useState({})

    const [portfolioMap, setPortfolioMap] = useState({})

    const [error, setError] = useState('')
    const [invalid, setInvalid] = useState(false)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        function transformPortfolios() {
            let temp = {}

            console.log(portfolios)

            if(portfolios !== undefined) {
                for(const portfolio of portfolios) {
                    temp[portfolio.p_id] = {
                        amount: portfolio.amount.$numberDecimal,
                        currency: portfolio.currency
                    } 
                } 
            }
            
            setPortfolioMap(temp)
            setLoading(false)
        }

        isMounted && transformPortfolios()
        return () => {
            isMounted = false
        }
    }, [portfolios])

    async function makeTransfer() {
        try {
            await axios.post('/users/transfer', {
                username: props.username,
                from,
                to,
                amount,
            })
            props.setTransferStatus("success", from, to, amount)
            props.closeModal()
        }
        catch (err) {
            props.setTransferStatus("error")
        }
    }

    function validateTransfer() {

        let regex = new RegExp(/^[0-9]+[.]?[0-9]+$/)

        // Test if the format is right
        let match = regex.test(amount)

        // If amount is left empty
        if (amount === '') {
            setInvalid(true)
            setError("Amount is required!")
        }
        // If the format of the amount is not correct
        else if (!match) {
            setInvalid(true)
            setError("Only numbers and dots allowed!")
        }
        else if (amount <= 0) {
            setInvalid(true)
            setError("Amount must be a pozitive number!")
        }
        // If the amount transfered is greater than the portfolio amount 
        else if (parseFloat(amount) > parseFloat(portfolioMap[from].amount)) {
            setInvalid(true)
            setError("Not enough money to transfer!")
        }
        else {
            setInvalid(false)
            setError('')
            makeTransfer()
        }
    }

    return (
        <Modal show={props.show} className="portfolio-delete" onHide={props.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Transfer Money</Modal.Title>
            </Modal.Header>
            {
                !loading?
                <Modal.Body>
                <label className="expanation">Transfer money from one portfolio to the other. These transfers will not show up as they are only displacements of money.</label>
                <div className='fields-div'>
                    <Form.Group className="amount-form">
                        <Form.Label className="form-label">From</Form.Label>
                        <Form.Control
                            style={{ marginBottom: "10px" }}
                            id="from_portfolio"
                            as="select"
                            className="mr-sm-2"
                            custom
                            value={from}
                            onChange={(event) => {
                                setFrom(event.target.value)
                                setAvailAmnt({
                                    amount: portfolioMap[event.target.value].amount,
                                    currency: portfolioMap[event.target.value].currency
                                })
                            }}
                        >
                            <option value="default" disabled>Transfer from this portfolio</option>
                            {
                                portfolios.map(portfolio => <option key={portfolio.p_id} value={portfolio.p_id}>{portfolio.p_name}</option>)
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="amount-form">
                        <Form.Label className="form-label">To</Form.Label>
                        <Form.Control
                            style={{ marginBottom: "10px" }}
                            id="to_portfolio"
                            as="select"
                            className="mr-sm-2"
                            custom
                            disabled={from === 'default'}
                            value={to}
                            onChange={(event) => setTo(event.target.value)}
                        >
                            <option value="default" disabled>Transfer to this portfolio</option>
                            {
                                portfolios.map(portfolio => {
                                    if (portfolio.p_id !== from && portfolio.currency === portfolioMap[from]?.currency)
                                        return <option key={portfolio.p_id} value={portfolio.p_id}>{portfolio.p_name}</option>
                                    return null
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="amount-form">
                        <Form.Label className="form-label">Amount</Form.Label>
                        <Form.Control
                            className="input-field"
                            type="number"
                            value={amount}
                            disabled={from === 'default' || to === 'default'}
                            placeholder="Enter transfer amount"
                            onChange={(event) => setAmount(event.target.value)}
                            isInvalid={invalid}
                        />
                        <Form.Control.Feedback type="invalid"> {error} </Form.Control.Feedback>
                    </Form.Group>
                    {from !== "default" ?
                        <label className="avail-label">
                            Available amount to transfer:
                                <label className="amount-avail">
                                <NumberFormat
                                    value={parseFloat(availAmnt.amount - amount).toFixed(2)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={availAmnt.currency + ' '}
                                />
                            </label>
                        </label> : null
                    }
                </div>
            </Modal.Body>:null
            }
            <Modal.Footer className="center-btns">
                <Button variant="secondary" onClick={props.closeModal}>Cancel</Button>
                <Button
                    variant="primary"
                    onClick={validateTransfer}
                >
                    Transfer
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default TransferModal
