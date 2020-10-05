import React, { useState, useEffect } from 'react'
import './WalletForm.scss'

// Form Validation
import * as yup from "yup"
import { Formik } from 'formik'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

// NanoID
import { nanoid } from 'nanoid'

// Axios
import axios from 'axios'

// Redux
import { useSelector } from 'react-redux'

// Icons
import { IconContext } from "react-icons"
import { BiWallet } from 'react-icons/bi'

function WalletForm(props) {

    const portfolios = useSelector((state) => state.user.portfolios)

    const [unavailable, setUnavailable] = useState([])

    const wallet_schema = yup.object({
        p_name: yup.string().required("Portfolio name is required!").matches(/^[a-zA-Z0-9\s]+$/, { message: "Only spaces and alphanumberic characters!" }).notOneOf(unavailable, "Name already used!"),
        currency: yup.string().required(),
        amount: yup.string().required("Amount is required!").matches(/(^[1-9]+[,.]{0,1}[0-9]+$)|(^[0]{1}[,.][0-9]+$)/, { message: "Only numbers and dots or commas allowed!" })
    })

    useEffect(() => {
        let isMounted = true 

        // Getting the list of the already used names
        function fillUnavailable() {
            let temp = []
            if(portfolios !== undefined) 
                portfolios.forEach(portfolio =>  temp.push(portfolio.p_name))
            setUnavailable(temp)
        }

        isMounted && fillUnavailable()

        return () => {
            isMounted = false
        }
    }, [portfolios])

    async function addPortfolio(event) {
        let portfolio = {...event}
        
        portfolio.amount = portfolio.amount.replace(',', '.')
        portfolio.p_id = nanoid(10)
        portfolio.type = "wallet"

        if (props.caller === "portfolio") {
            try {
                await axios.post('users/add-portfolio', { username: props.username, portfolio })
                props.setStatus("success", portfolio)
            }
            catch (err) {
                props.setStatus("error")
            }
        }
        else {
            props.setPortfolio(portfolio)
            props.closeModal()
        }
    }

    return (
        <Formik
            validationSchema={wallet_schema}
            onSubmit={addPortfolio}
            initialValues={{
                p_name: '',
                amount: '',
                currency: 'ALL'
            }}
        >
            {
                ({
                    handleSubmit,
                    handleChange,
                    values,
                    touched,
                    errors,
                    isSubmitting
                }) => (
                        <Form noValidate onSubmit={handleSubmit} id="wallet-form" className="wallet-form">
                            <Form.Group as={Row} controlId="p_name">
                                <Form.Label column md={3} sm={3} xs={3}> Name </Form.Label>
                                <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
                                    <Form.Control
                                        value={values.p_name}
                                        onChange={handleChange}
                                        type="string"
                                        placeholder="Choose the name of your wallet"
                                        isInvalid={touched.p_name && errors.p_name}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.p_name}  </Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column md={3} sm={3} xs={3}> Amount </Form.Label>
                                <Col md={6} sm={6} xs={6} style={{ padding: "0" }}>
                                    <Form.Control
                                        id="amount"
                                        type="string"
                                        placeholder="Enter the amount"
                                        value={values.amount}
                                        onChange={handleChange}
                                        isInvalid={touched.amount && errors.amount} 
                                        inputMode="decimal"
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.amount}  </Form.Control.Feedback>
                                </Col>
                                <Col md={3} sm={3} xs={3}>
                                    <Form.Control
                                        id="currency"
                                        as="select"
                                        className="mr-sm-2"
                                        custom
                                        value={values.currency}
                                        onChange={handleChange}
                                        isInvalid={touched.currency && errors.currency}
                                    >
                                        <option value="ALL">ALL</option>
                                        {/* <option value="$">$</option>
                                        <option value="€">€</option> */}
                                    </Form.Control>
                                </Col>
                            </Form.Group>

                            <Form.Row className="btn-row">
                                <Button variant="primary" type="submit" form="wallet-form" disabled={isSubmitting}>
                                    {
                                        isSubmitting ?
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                            :
                                            <span>
                                                Add Portfolio
                                                <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-4px' } }}>
                                                    <BiWallet />
                                                </IconContext.Provider>
                                            </span>
                                    }
                                </Button>
                            </Form.Row>
                        </Form>
                    )
            }
        </Formik>
    )
}

export default WalletForm 