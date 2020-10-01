import React from 'react'
import './CardForm.scss'

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

// Icons
import { IconContext } from "react-icons"
import { BiWallet } from 'react-icons/bi'

const card_schema = yup.object({
    p_name: yup.string().required("Name is required!").matches(/^[a-zA-Z0-9\s]+$/, { message:  "Only spaces and alphanumeric characters!" }),
    amount: yup.string().required("Amount is required!").matches(/^[0-9]+[.]?[0-9]+$/, { message: "Only numbers and dots allowed!"}),
    currency: yup.string().required(),
    bank: yup.string().required("Bank is required!").matches(/^[a-zA-Z0-9\s]+$/, { message:  "Only spaces and alphanumeric characters!" }),
    card_no: yup.string().required("Card number is required!").matches(/^[0-9]{4}[\s][0-9]{4}[\s][0-9]{4}[\s][0-9]{4}$/, { message: "Format is xxxx xxxx xxxx xxxx!"}),
    valid_m: yup.number().required("Required!").max(12, "LEss than 12").min(1, "More than 1"),
    valid_y: yup.number().required("Required!"),
    card_holder: yup.string().required("Card holder required!").matches(/^[a-zA-Z\s]+$/, { message: "Only spaces and alphanumeric characters!"}),
    cvc: yup.string().required().length(3) // no space
})

function CardForm(props) {

    async function addPortfolio(event) {
        if(props.caller==="portfolio") {
            try {
                await axios.post('users/add-portfolio', { username: props.username, portfolio: event})
                props.setStatus("success", event)
            }
            catch(err) {
                props.setStatus("error")
            }  
        }
        else {
            props.setPortfolio(event)
            props.closeModal()
        }
    }

    return (
        <Formik
            validationSchema={card_schema}
            onSubmit={addPortfolio}
            initialValues={{
                p_name: '',
                p_id: nanoid(10),
                amount: '',
                currency: 'ALL',
                type: "credit card",
                bank: '',
                card_no: '',
                valid_m: '',
                valid_y: '',
                card_holder: '',
                cvc: ''
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
                        <Form noValidate onSubmit={handleSubmit} id="card-form" className="card-form">
                            <Form.Group as={Row} controlId="p_name">
                                <Form.Label column md={3} sm={3} xs={3}> Name </Form.Label>
                                <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
                                    <Form.Control
                                        value={values.p_name}
                                        onChange={handleChange}
                                        type="string"
                                        placeholder="Choose the name of your card"
                                        isInvalid={touched.p_name && errors.p_name}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.p_name} </Form.Control.Feedback>
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
                                        inputmode="decimal"
                                        isInvalid={touched.amount && errors.amount}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.amount} </Form.Control.Feedback>
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
                                        <option value="Dollar">$</option>
                                        <option value="Euro">€</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="bank">
                                <Form.Label column md={3} sm={3} xs={3}> Bank </Form.Label>
                                <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
                                    <Form.Control
                                        value={values.bank}
                                        onChange={handleChange}
                                        type="string"
                                        placeholder="Enter the bank"
                                        isInvalid={touched.bank && errors.bank}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.bank} </Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column md={3} sm={3} xs={3}> Card No. </Form.Label>
                                <Col md={7} sm={7} xs={7} style={{ padding: "0px 15px 0px 0px" }}>
                                    <Form.Control
                                        id="card_no"
                                        value={values.card_no}
                                        onChange={handleChange}
                                        type="string"
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        isInvalid={touched.card_no && errors.card_no}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.card_no} </Form.Control.Feedback>
                                </Col>
                                <Col md={2} sm={2} xs={2} style={{ padding: "0px 15px 0px 0px" }}>
                                    <Form.Control
                                        id="cvc"
                                        value={values.cvc}
                                        onChange={handleChange}
                                        type="number"
                                        placeholder="cvc"
                                        isInvalid={touched.cvc && errors.cvc}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label column md={3} sm={3} xs={3}> Valid </Form.Label>
                                <Col md={4} sm={4} xs={4} style={{ padding: "0" }}>
                                    <Form.Control
                                        id="valid_m"
                                        type="number"
                                        placeholder="MM"
                                        value={values.valid_m}
                                        onChange={handleChange}
                                        isInvalid={touched.valid_m && errors.valid_m}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.valid_m} </Form.Control.Feedback>
                                </Col>
                                <Col md={5} sm={5} xs={5}>
                                    <Form.Control
                                        id="valid_y"
                                        type="number"
                                        placeholder="YY"
                                        value={values.valid_y}
                                        onChange={handleChange}
                                        isInvalid={touched.valid_y && errors.valid_y}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.valid_y} </Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="card_holder">
                                <Form.Label column md={3} sm={3} xs={4}> Card Holder </Form.Label>
                                <Col md={9} sm={9} xs={8} style={{ padding: "0px 15px 0px 0px" }}>
                                    <Form.Control
                                        value={values.card_holder}
                                        onChange={handleChange}
                                        type="string"
                                        placeholder="Enter the card holder name"
                                        isInvalid={touched.card_holder && errors.card_holder}
                                    />
                                    <Form.Control.Feedback type="invalid"> {errors.card_holder} </Form.Control.Feedback>
                                </Col>
                            </Form.Group>


                            <Form.Row className="btn-row">
                                <Button variant="primary" type="submit" form="card-form" disabled={isSubmitting}>
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

export default CardForm 