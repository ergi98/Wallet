import React from 'react'
import './SpendingTransaction.scss'

// Axios
import axios from 'axios'

// NanoID
import { nanoid } from 'nanoid'

// Components
import Layout from '../layout/Layout'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/esm/Button'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'

// Icons
import { IconContext } from "react-icons"
import { FaMapMarkedAlt } from 'react-icons/fa'
import { AiOutlineFileDone } from 'react-icons/ai'

// Form Validation
import * as yup from "yup"
import { Formik } from 'formik'

// Date Validation
import { parse } from "date-fns"

// Redux 
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


// Establish the validation schema
const transaction_schema = yup.object({
    date: yup.string().required().transform(parseDate),
    hours: yup.string().required().max(2),
    minutes: yup.string().required().max(2),
    long: yup.string(),
    lat: yup.string(),
    amount: yup.string().required().matches(/^[0-9]+[.]?[0-9]+$/).notOneOf(["0"]),
    currency: yup.string().required(),
    portfolio: yup.string().required().notOneOf(["Choose portfolio to withdraw ..."]),
    category: yup.string().required().notOneOf(["Choose category of expense ..."]),
    description: yup.string().required().max(30).matches(/^[A-Za-z0-9 _.,]*[A-Za-z0-9][A-Za-z0-9 _.,]*$/),
    long_desc: yup.string().notRequired().max(100).matches(/^[A-Za-z0-9 _.,]*[A-Za-z0-9][A-Za-z0-9 _.,]*$/)
});

function parseDate(value, originalValue) {
    const parsedDate = parse(originalValue, "dd/MM/yyyy", new Date())

    if (parsedDate.toJSON() !== null) {
        return parsedDate.toLocaleDateString('en-GB')
    }

    return false
}

class SpendingTransaction extends React.Component {

    constructor() {
        super()

        this._isMounted = false

        this.state = {
            isDateChecked: false,
            isTimeChecked: false,
            isLocationChecked: false,
            categories: [],
            portfolios: [],
            displayError: false,
            displaySuccess: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this._isMounted = true
        this._isMounted  && this.getValues()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    async getValues() {
        try {
            let res = await axios.post('/users/populate-transactions', { username: this.props.username, type: "expense" }) 

            if (res.data.result.length > 0) {
                let { categories, portfolios } = res.data.result[0]

                this._isMounted  && this.setState({
                    categories,
                    portfolios
                })
            }
        }
        catch(err) {
            console.log(err)
        }
    }

    async handleSubmit(event,{ resetForm }) {
        if (event.hours < 10)
            event.hours = `0${event.hours}`
        if (event.minutes < 10)
            event.minutes = `0${event.minutes}`

        let transaction = {
            trans_id: nanoid(10),
            time: `${event.hours}:${event.minutes}`,
            trans_type: 'expense',
            amount: event.amount,
            currency: event.currency,
            portfolio: event.portfolio,
            type: event.category,
            short_desc: event.description,
            location: {
                longitude: event.long,
                latitude: event.lat
            }
        }

        if(event.long_desc !== '') 
            transaction.desc = event.long_desc

        try {
            await axios.post('/transactions/new-transaction', {
                username: this.props.username,
                date: event.date,
                transaction
            })
            this._isMounted  && this.setState({
                displaySuccess: true
            })
            setTimeout(() => {
                this._isMounted  && this.setState({
                    displaySuccess: false
                })
            }, 2500);
            resetForm({})
        }
        catch(error) {
            this._isMounted  && this.setState({
                displayError: true
            })
            setTimeout(() => {
                this._isMounted  && this.setState({
                    displayError: false
                })
            }, 2500);
        }
    }

    render() {
        return (
            <Layout>
                <Container className="transaction-container">
                    <Alert show={this.state.displaySuccess} variant="success" className="alert" as="Row">
                        <Alert.Heading className="heading">Transaction Succeeded</Alert.Heading>
                        Successfully register transaction!
                    </Alert>
                    <Alert show={this.state.displayError} variant="danger" className="alert" as="Row">
                        <Alert.Heading className="heading">Transaction Failed</Alert.Heading>
                        The transaction you are trying to register did not go through!
                    </Alert>
                    <Container className="pad-container">
                        <Row className="title">
                            <h4>Register Expense</h4>
                        </Row>
                        <Row className="form-row">
                            <Formik
                                validationSchema={transaction_schema}
                                onSubmit={this.handleSubmit}
                                initialValues={{
                                    date: '',
                                    hours: '',
                                    minutes: '',
                                    long: '',
                                    lat: '',
                                    amount: '',
                                    currency: 'ALL',
                                    portfolio: 'Choose portfolio to withdraw ...',
                                    category: 'Choose category of expense ...',
                                    description: '',
                                    long_desc: ''
                                }}
                            >
                                {({
                                    handleSubmit,
                                    handleChange,
                                    values,
                                    touched,
                                    errors,
                                    isSubmitting,
                                    setFieldValue
                                }) => (
                                        <Form noValidate onSubmit={handleSubmit} id="transaction-form">
                                            <Form.Group as={Row} controlId="date" className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3} > Date </Form.Label>
                                                <Col md={6} sm={6} xs={6} style={{ padding: "0px" }}>
                                                    <Form.Control
                                                        value={values.date}
                                                        onChange={handleChange}
                                                        type="string"
                                                        placeholder="Date"
                                                        isInvalid={touched.date && errors.date}
                                                        readOnly={this.state.isDateChecked}
                                                    />
                                                </Col>
                                                <Col md={3} sm={3} xs={3}>
                                                    <Form.Check type="checkbox" label="Auto" onChange={(event) => {
                                                        if (event.target.checked) {
                                                            setFieldValue("date", new Date().toLocaleDateString('en-GB'))
                                                            this.setState({
                                                                isDateChecked: event.target.checked
                                                            })
                                                        }
                                                        else {
                                                            setFieldValue("date", '')
                                                            this.setState({
                                                                isDateChecked: event.target.checked
                                                            })
                                                        }
                                                    }} />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3} > Time </Form.Label>
                                                <Col md={3} sm={3} xs={3} style={{ padding: "0px" }}>
                                                    <Form.Control
                                                        id="hours"
                                                        value={values.hours}
                                                        onChange={handleChange}
                                                        type="string"
                                                        placeholder="Hour"
                                                        isInvalid={touched.hours && errors.hours}
                                                        readOnly={this.state.isTimeChecked}
                                                    />
                                                </Col>
                                                <Col md="auto" sm="auto" xs="auto" style={{ padding: "0px 5px" }}> : </Col>
                                                <Col md={3} sm={3} xs={3} style={{ padding: "0px" }}>
                                                    <Form.Control
                                                        id="minutes"
                                                        value={values.minutes}
                                                        onChange={handleChange}
                                                        type="string"
                                                        placeholder="Minutes"
                                                        isInvalid={touched.minutes && errors.minutes}
                                                        readOnly={this.state.isTimeChecked}
                                                    />
                                                </Col>
                                                <Col md={2} sm={2} xs={2}>
                                                    <Form.Check type="checkbox" id="time" label="Auto" onChange={(event) => {
                                                        if (event.target.checked) {
                                                            let date = new Date()
                                                            setFieldValue("hours", date.getHours())
                                                            setFieldValue("minutes", date.getMinutes())
                                                            this.setState({
                                                                isTimeChecked: event.target.checked
                                                            })
                                                        }
                                                        else {
                                                            setFieldValue("hours", '')
                                                            setFieldValue("minutes", '')
                                                            this.setState({
                                                                isTimeChecked: event.target.checked
                                                            })
                                                        }
                                                    }} />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3}> Location </Form.Label>
                                                <Col md={4} sm={4} xs={4} style={{ padding: "0" }}>
                                                    <Form.Control
                                                        id="long"
                                                        value={values.long}
                                                        onChange={handleChange}
                                                        type="string"
                                                        placeholder="Longitude"
                                                        isInvalid={touched.long && errors.long}
                                                        style={{ display: "none" }}
                                                    />
                                                    <Form.Control
                                                        id="lat"
                                                        value={values.lat}
                                                        onChange={handleChange}
                                                        type="string"
                                                        placeholder="Latitude"
                                                        isInvalid={touched.lat && errors.lat}
                                                        readOnly={this.state.isTimeChecked}
                                                        style={{ display: "none" }}
                                                    />
                                                    <Button
                                                        variant="primary"
                                                        style={{ width: "100%" }}
                                                        disabled={this.state.isLocationChecked}
                                                    >
                                                        Choose
                                                    <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-7px' } }}>
                                                            <FaMapMarkedAlt />
                                                        </IconContext.Provider>
                                                    </Button>
                                                </Col>
                                                <Col md={5} sm={5} xs={5}>
                                                    <Form.Check type="checkbox" id="location" label="Current Location" onChange={(event) => {
                                                        if (event.target.checked) {
                                                            navigator.geolocation.getCurrentPosition(pos => {
                                                                setFieldValue("long", pos.coords.latitude)
                                                                setFieldValue("lat", pos.coords.longitude)
                                                            })
                                                            this.setState({
                                                                isLocationChecked: event.target.checked
                                                            })
                                                        }
                                                        else {
                                                            setFieldValue("long", '')
                                                            setFieldValue("lat", '')
                                                            this.setState({
                                                                isLocationChecked: event.target.checked
                                                            })
                                                        }
                                                    }} />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3}> Amount </Form.Label>
                                                <Col md={6} sm={6} xs={6} style={{ padding: "0" }}>
                                                    <Form.Control
                                                        id="amount"
                                                        type="string"
                                                        placeholder="Amount"
                                                        value={values.amount}
                                                        onChange={handleChange}
                                                        isInvalid={touched.amount && errors.amount}
                                                    />
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

                                            <Form.Group as={Row} controlId="portfolio" className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3}> Portfolio </Form.Label>
                                                <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
                                                    <Form.Control
                                                        as="select"
                                                        className="mr-sm-2"
                                                        custom
                                                        value={values.portfolio}
                                                        onChange={handleChange}
                                                        isInvalid={touched.portfolio && errors.portfolio}
                                                    >
                                                        <option disabled>Choose portfolio to withdraw ...</option>
                                                        {
                                                            this.state.portfolios.map(portfolio =>
                                                                <option
                                                                    value={portfolio.p_id}
                                                                    key={portfolio.p_id}
                                                                >
                                                                    {portfolio.p_name}
                                                                </option>
                                                            )
                                                        }
                                                    </Form.Control>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} controlId="category" className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3}> Category </Form.Label>
                                                <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
                                                    <Form.Control
                                                        as="select"
                                                        className="mr-sm-2"
                                                        custom
                                                        value={values.category}
                                                        onChange={handleChange}
                                                        isInvalid={touched.category && errors.category}
                                                    >
                                                        <option disabled>Choose category of expense ...</option>
                                                        {
                                                            this.state.categories.map(category =>
                                                                <option
                                                                    value={category.cat_id}
                                                                    key={category.cat_id}
                                                                >
                                                                    {category.cat_name}
                                                                </option>
                                                            )
                                                        }
                                                    </Form.Control>
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Row} controlId="description" className="align-items-center">
                                                <Form.Label column md={3} sm={3} xs={3}> Description </Form.Label>
                                                <Col md={9} sm={9} xs={9} style={{ padding: "0px 15px 0px 0px" }}>
                                                    <Form.Control
                                                        type="string"
                                                        placeholder="Description"
                                                        value={values.description}
                                                        onChange={handleChange}
                                                        isInvalid={touched.description && errors.description}
                                                    />
                                                </Col>
                                            </Form.Group>

                                            <Form.Group as={Container} controlId="long_desc" className="align-items-center" style={{ padding: "0px" }}>
                                                <Form.Label> Detailed Description </Form.Label>
                                                <Col style={{ padding: "0px 0px 0px 0px" }}>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows="2"
                                                        name="long_desc"
                                                        laceholder="Detailed Description"
                                                        style={{ resize: "none" }}
                                                        value={values.long_desc}
                                                        onChange={handleChange}
                                                        isInvalid={touched.long_desc && errors.long_desc}
                                                    />
                                                </Col>
                                            </Form.Group>

                                            <Form.Row className="btn-row">
                                                <Button variant="primary" type="submit" form="transaction-form" disabled={isSubmitting}>
                                                    {   isSubmitting?
                                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                                                        : 
                                                        <span>
                                                            Finalize
                                                            <IconContext.Provider value={{ size: "25", style: { verticalAlign: 'middle', marginLeft: '10px', marginTop: '-4px' } }}>
                                                                <AiOutlineFileDone />
                                                            </IconContext.Provider> 
                                                        </span>
                                                    }
                                                </Button>
                                            </Form.Row>
                                        </Form>
                                    )}
                            </Formik>
                        </Row>
                    </Container>
                </Container>
            </Layout>
        )
    }
}


const mapPropsToState = state => ({
    username: state.user.username
})

SpendingTransaction.propTypes = {
    username: PropTypes.string.isRequired
}

export default connect(mapPropsToState, null)(SpendingTransaction)